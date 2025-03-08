"use client";
import React from "react";
import { useState, useRef, useEffect, FormEvent } from "react";
import { Button, TextField } from "@mui/material";
import { Chat } from "@mui/icons-material";
import axios from "axios";

interface Message {
  sender: "User" | "Bot";
  text: string;
}

interface FloatingChatbotProps {
  apiUrl: string; // Allow dynamic API URL
}

const FloatingChatbot: React.FC<FloatingChatbotProps> = ({ apiUrl }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage: Message = { sender: "User", text: query };
    setConversation((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post<{ answer: string }>(apiUrl, {
        question: query,
        type: "",
      });

      const botMessage: Message = { sender: "Bot", text: response.data.answer };
      setConversation((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("API Error:", error);
      setConversation((prev) => [
        ...prev,
        { sender: "Bot", text: "Sorry, something went wrong." },
      ]);
    }

    setQuery("");
  };

  return (
    <div className="fixed bottom-5 right-5 flex flex-col items-end">
      {open && (
        <div className="w-80 h-96 bg-white shadow-xl rounded-lg p-4 border border-gray-300 mb-4 mr-4 flex flex-col">
          <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide">
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "User" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-2 rounded-lg max-w-[75%] ${
                    msg.sender === "User" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="h-[15%] flex items-center">
            <TextField
              label="Enter Query"
              multiline
              rows={1}
              variant="outlined"
              fullWidth
              value={query}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        </div>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(!open)}
        style={{
          borderRadius: "50%",
          width: "56px",
          height: "56px",
          minWidth: "unset",
        }}
      >
        <Chat />
      </Button>
    </div>
  );
};

export default FloatingChatbot;
