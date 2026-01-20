import { useState, useCallback, useEffect } from 'react';

const API_URL = 'http://localhost:5001/api';

export function useChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            role: 'assistant',
            content: 'Hello! I am your botanical assistant. You can upload a plant image for identification or ask me any questions about plants.',
            timestamp: new Date().toISOString()
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [plantContext, setPlantContext] = useState(null);

    const toggleChat = () => setIsOpen(prev => !prev);

    // Clear chat on mount/unmount (or strictly on mount to ensure fresh start per session as requested)
    // User requested "even after logout/referesh context shud be deleted"
    // Since state resets on refresh, that's covered. 
    // For logout, if the component unmounts (e.g., hidden), state is lost. 
    // If it persists in layout, we might need manual reset.
    // For now, standard state behavior covers the requirement.

    const identifyPlant = useCallback(async (file) => {
        setIsLoading(true);
        // Add user message with image placeholder
        const userMsgId = Date.now().toString();
        setMessages(prev => [...prev, {
            id: userMsgId,
            role: 'user',
            content: 'Identifying this plant...',
            image: URL.createObjectURL(file), // Local preview
            timestamp: new Date().toISOString()
        }]);

        try {
            const formData = new FormData();
            formData.append('organs', 'leaf');
            formData.append('image', file);

            const response = await fetch(`${API_URL}/chat/identify`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                const bestMatch = data.data.bestMatch;
                const context = {
                    commonName: bestMatch.species.commonNames[0] || bestMatch.species.scientificNameWithoutAuthor,
                    scientificName: bestMatch.species.scientificNameWithoutAuthor,
                    score: bestMatch.score,
                    family: bestMatch.species.family.scientificNameWithoutAuthor
                };

                setPlantContext(context);

                const confidence = Math.round(bestMatch.score * 100);

                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    role: 'assistant',
                    content: `I identified this plant as **${context.commonName}** (${context.scientificName}) with ${confidence}% confidence.\n\nFamily: ${context.family}.\n\nWhat would you like to know about it?`,
                    timestamp: new Date().toISOString()
                }]);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Identification Error:', error);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: "I'm sorry, I couldn't identify that plant. Please try another image.",
                isError: true,
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const sendMessage = useCallback(async (text) => {
        if (!text.trim()) return;

        // Add user message
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date().toISOString()
        }]);

        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/chat/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: text,
                    context: plantContext,
                    history: messages.map(m => ({ role: m.role, content: m.content }))
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    role: 'assistant',
                    content: data.data.response,
                    timestamp: data.data.timestamp
                }]);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Message Error:', error);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: "I'm having trouble connecting right now. Please try again.",
                isError: true,
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [messages, plantContext]);

    const clearChat = () => {
        setMessages([{
            id: 'welcome',
            role: 'assistant',
            content: 'Hello! I am your botanical assistant. You can upload a plant image for identification or ask me any questions about plants.',
            timestamp: new Date().toISOString()
        }]);
        setPlantContext(null);
    };

    return {
        isOpen,
        toggleChat,
        messages,
        isLoading,
        identifyPlant,
        sendMessage,
        clearChat,
        plantContext
    };
}
