/* eslint-disable @next/next/no-img-element */
"use client";
import * as React from 'react'
import { useEffect, useState } from 'react';
import { ArrowLeft, Search, Send, MoreVertical, Smile, Package, MessageCircleDashed } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import Pusher from 'pusher-js';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
interface Message {
    id: string;
    content: string;
    status: string;
    conversationId: string;
    createdAt: string;
    senderId: string;
}

type ProductImage = {
    id: string;
    url: string;
}
type ChatConversation = {
    id: number;
    productId: string;
    senderId: string;
    receiverId: string;
    product: {
        id: string;
        name: string;
        description: string;
        price: number;
        category: string;
        condition: string;
        images: ProductImage[];
    };
    sender: {
        id: string;
        name: string;
        email: string;
        image: string | null;
        isAdmin: boolean;
        createdAt: string;
        updatedAt: string;
    };
    receiver: {
        id: string;
        name: string;
        email: string;
        image: string | null;
        isAdmin: boolean;
        createdAt: string;
        updatedAt: string;
    },
    messages: ChatConvoMessage[]
};

type ChatConvoMessage = {
    id: number;
    content: string;
    conversationId: number;
    senderId: string;
    createdAt: string;
}

type ProductResponse = {
    id: string;
    name: string;
    description: string;
    price: number;
    status: string;
    category: string;
    condition: string
    userId: string;
    locationCoords: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        name: string;
        image: string;
    }
};

function Chat() {
    const session = useSession();
    const userId = session.data?.user.id;
    const searchParams = useSearchParams();
    const productId = searchParams.get('product');
    const [selectedChat, setSelectedChat] = useState<number>();
    const [messageInput, setMessageInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [productInfo, setProductInfo] = useState<ProductResponse>();
    const [conversations, setConversations] = useState<ChatConversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isOnline, setIsOnline] = useState(false);
    const lastSeenRef = React.useRef<number>(Date.now());

    const updateChatConversations = () => {
        axios.get("/api/conversation").then((res) => {
            setConversations(res.data.conversations);
        })
    }
    useEffect(() => {
        updateChatConversations()
    }, [])

    useEffect(() => {
        if (productId) {
            axios.get("/api/product/" + productId).then((res) => {
                setProductInfo(res.data.product);
            })
        }
    }, [productId])

    useEffect(() => {
        if (productInfo) {
            axios.post("/api/conversation", {
                productId: productInfo.id,
                receiverId: productInfo.user.id
            }).then((res) => {
                if (res.data.success) {
                    console.log(res.data);
                    updateChatConversations();
                    setSelectedChat(res.data.chatInfo.id);
                }
            })
        }
    }, [productInfo])

    useEffect(() => {
        if (selectedChat) {
            // fetch existing messages
            setMessages([]);
            axios.get("/api/conversation/message/" + selectedChat).then((res) => {
                if (res.data.success) {
                    setMessages(res.data.messages);
                }
            })
            const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
                cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
            });
            const channel = pusher.subscribe(`conversation-${selectedChat}`);

            channel.bind("new-message", (message: Message) => {
                setMessages(prev => [...prev, message]);
            });

            // Listen for online presence
            channel.bind('online-presence', (user: { id: string }) => {
                if (user.id !== userId) {
                    lastSeenRef.current = Date.now();
                    setIsOnline(true);
                }
            });

            // Interval to check if user is still online
            const onlineCheck = setInterval(() => {
                if (Date.now() - lastSeenRef.current > 5000) {
                    setIsOnline(false);
                }
            }, 2000);

            // Heartbeat to server via API
            const heartbeat = setInterval(() => {
                fetch('/api/pusher/presence', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ conversationId: selectedChat, userId }),
                });
            }, 5000);
            return () => {
                clearInterval(heartbeat);
                clearInterval(onlineCheck);
                channel.unbind_all();
                channel.unsubscribe();
            };
        }
    }, [selectedChat, userId]);
    // Sample chat data
    // const conversations: ChatConversation[] = [
    //     {
    //         id: '1',
    //         sellerName: 'Sarah M.',
    //         sellerAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    //         productName: 'Vintage Leather Jacket',
    //         productImage: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=100',
    //         lastMessage: 'Yes, it\'s still available! When would you like to meet?',
    //         lastMessageTime: '2:30 PM',
    //         unreadCount: 2,
    //         isOnline: true,
    //         messages: [
    //             {
    //                 id: '1',
    //                 text: 'Hi! I\'m interested in the vintage leather jacket. Is it still available?',
    //                 timestamp: '2:15 PM',
    //                 sender: 'user',
    //                 status: 'read'
    //             },
    //             {
    //                 id: '2',
    //                 text: 'Hello! Yes, it\'s still available. It\'s in excellent condition, barely worn.',
    //                 timestamp: '2:20 PM',
    //                 sender: 'seller'
    //             },
    //             {
    //                 id: '3',
    //                 text: 'That sounds great! Can you tell me more about the size and fit?',
    //                 timestamp: '2:25 PM',
    //                 sender: 'user',
    //                 status: 'read'
    //             },
    //             {
    //                 id: '4',
    //                 text: 'It\'s a size Medium, fits true to size. I can send you more detailed photos if you\'d like.',
    //                 timestamp: '2:28 PM',
    //                 sender: 'seller'
    //             },
    //             {
    //                 id: '5',
    //                 text: 'Yes, it\'s still available! When would you like to meet?',
    //                 timestamp: '2:30 PM',
    //                 sender: 'seller'
    //             }
    //         ]
    //     },
    //     {
    //         id: '2',
    //         sellerName: 'Mike R.',
    //         sellerAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    //         productName: 'MacBook Pro 2019',
    //         productImage: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=100',
    //         lastMessage: 'Sure, I can meet tomorrow at 3 PM',
    //         lastMessageTime: '1:45 PM',
    //         unreadCount: 0,
    //         isOnline: false,
    //         messages: [
    //             {
    //                 id: '1',
    //                 text: 'Hi! Is the MacBook still available?',
    //                 timestamp: '1:30 PM',
    //                 sender: 'user',
    //                 status: 'read'
    //             },
    //             {
    //                 id: '2',
    //                 text: 'Yes it is! It\'s in great condition, comes with the original charger.',
    //                 timestamp: '1:35 PM',
    //                 sender: 'seller'
    //             },
    //             {
    //                 id: '3',
    //                 text: 'Perfect! Can we meet somewhere public to check it out?',
    //                 timestamp: '1:40 PM',
    //                 sender: 'user',
    //                 status: 'read'
    //             },
    //             {
    //                 id: '4',
    //                 text: 'Sure, I can meet tomorrow at 3 PM',
    //                 timestamp: '1:45 PM',
    //                 sender: 'seller'
    //             }
    //         ]
    //     },
    //     {
    //         id: '3',
    //         sellerName: 'Alex K.',
    //         sellerAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    //         productName: 'Acoustic Guitar',
    //         productImage: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=100',
    //         lastMessage: 'Thanks for your interest!',
    //         lastMessageTime: '12:20 PM',
    //         unreadCount: 1,
    //         isOnline: true,
    //         messages: [
    //             {
    //                 id: '1',
    //                 text: 'Hello! I saw your acoustic guitar listing. Does it come with a case?',
    //                 timestamp: '12:15 PM',
    //                 sender: 'user',
    //                 status: 'read'
    //             },
    //             {
    //                 id: '2',
    //                 text: 'Thanks for your interest!',
    //                 timestamp: '12:20 PM',
    //                 sender: 'seller'
    //             }
    //         ]
    //     }
    // ];

    const currentChat = conversations.find(chat => chat.id == selectedChat);

    const handleSendMessage = async () => {
        if (messageInput.trim() && currentChat) {
            // In a real app, you would send this to your backend
            console.log('Sending message:', messageInput);
            const res = await axios.post("/api/conversation/message/" + selectedChat, {
                content: messageInput
            })
            if (res.data.success) {
                toast.success("Message Sent");
            }
            else {
                toast.error("Some error occurred");
            }
            setMessageInput('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const filteredConversations = conversations;
    // const filteredConversations = conversations.filter(chat =>
    //     true
    //     // chat.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //     // chat.productName.toLowerCase().includes(searchQuery.toLowerCase())
    // );

    return (
        <div className="min-h-[100dvh] bg-black text-white flex">
            {/* Sidebar - Chat List */}
            <div className={`${currentChat && "hidden"} w-full md:w-80 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border-r border-gray-800/50 md:flex flex-col`}>
                {/* Header */}
                <div className="p-4 border-b border-gray-800/50">
                    <div className="flex items-center justify-between mb-4">
                        <Link
                            href="/dashboard"
                            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all group"
                        >
                            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                            <span>Back</span>
                        </Link>
                        <div className="flex items-center space-x-2">
                            <Package className="h-6 w-6 text-emerald-400" />
                            <span className="font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                Messages
                            </span>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition-all"
                        />
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => setSelectedChat(chat.id)}
                            className={`p-4 border-b border-gray-800/30 cursor-pointer transition-all hover:bg-gray-800/30 ${selectedChat === chat.id ? 'bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-r-2 border-r-emerald-400' : ''
                                }`}
                        >
                            <div className="flex items-start space-x-3">
                                <div className="relative">
                                    <img
                                        src={chat.senderId == userId ? (chat.receiver.image ?? '/default-avatar.png') : (chat.sender.image ?? '/default-avatar.png')}
                                        alt={chat.senderId == userId ? chat.receiver.name : chat.sender.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    {isOnline && (
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-semibold text-white truncate">{chat.senderId == userId ? chat.receiver.name : chat.sender.name}</h3>
                                        {messages.length > 0 ?
                                            <span className="text-xs text-gray-400">
                                                {format(new Date(messages[messages.length - 1].createdAt), 'dd MMM yyyy, hh:mm a')}
                                            </span> :
                                            chat.messages[0] && <span className="text-xs text-gray-400">
                                                {format(new Date(chat.messages[0].createdAt), 'dd MMM yyyy, hh:mm a')}
                                            </span>
                                        }
                                    </div>

                                    <div className="flex items-center space-x-2 mb-1">
                                        {/* <img
                                            src={chat.productImage}
                                            alt={chat.productName}
                                            className="w-6 h-6 rounded object-cover"
                                        /> */}
                                        <span className="text-xs text-emerald-400 truncate">{chat.product.name}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        {messages.length > 0 ?
                                            <p className="text-sm text-gray-300 truncate">{messages[messages.length - 1].content}</p>
                                            :
                                            chat.messages[0] && <p className="text-sm text-gray-300 truncate">{chat.messages[0].content}</p>}
                                        {/* <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                            Unread
                                        </span> */}
                                        {/* {chat.unreadCount > 0 && (
                                            <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                                {chat.unreadCount}
                                            </span>
                                        )} */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            { }

            {/* Main Chat Area */}
            <div className={currentChat ? "flex-1 flex flex-col" : "hidden flex-1 md:flex flex-col"}>
                {currentChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border-b border-gray-800/50 p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className='flex md:hidden' onClick={() => setSelectedChat(undefined)}>
                                        <ArrowLeft />
                                    </div>
                                    <div className="relative">
                                        <img
                                            src={currentChat.senderId == userId ? (currentChat.receiver.image ?? '/default-avatar.png') : (currentChat.sender.image ?? '/default-avatar.png')}
                                            alt={currentChat.senderId == userId ? currentChat.receiver.name : currentChat.sender.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        {isOnline && (
                                            <div className="absolute -bottom-1 -right-1 size-4 bg-green-500 rounded-full border-2 border-black"></div>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-white">{currentChat.senderId == userId ? currentChat.receiver.name : currentChat.sender.name}</h3>
                                        <div className="flex items-center space-x-2">
                                            {/* <img
                                                src={currentChat.product.images[0].url}
                                                alt={currentChat.product.name}
                                                className="w-4 h-4 rounded object-cover"
                                            /> */}
                                            <span className="text-xs text-emerald-400">{currentChat.product.name}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    {/* <button className="p-2 hover:bg-gray-800/50 rounded-lg transition-all">
                                        <Phone className="h-5 w-5 text-gray-400 hover:text-emerald-400" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-800/50 rounded-lg transition-all">
                                        <Video className="h-5 w-5 text-gray-400 hover:text-cyan-400" />
                                    </button> */}
                                    <button className="p-2 hover:bg-gray-800/50 rounded-lg transition-all">
                                        <MoreVertical className="h-5 w-5 text-gray-400 hover:text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length == 0 && <EmptyMessage />}
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${message.senderId === userId
                                            ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                                            : 'bg-gray-800/80 text-white'
                                            }`}
                                    >
                                        <p className="text-sm">{message.content}</p>
                                        <div className="flex items-center justify-end mt-1 space-x-1">
                                            <span className="text-xs opacity-70">{format(new Date(message.createdAt), 'dd MMM yyyy, hh:mm a')}</span>
                                            {message.senderId === userId && message.status && (
                                                <div className={`w-4 h-4 ${message.status === 'read' ? 'text-blue-300' : 'text-gray-300'
                                                    }`}>
                                                    <svg viewBox="0 0 16 16" className="w-full h-full fill-current">
                                                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                                                        {message.status === 'read' && (
                                                            <path d="M10.854 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 8.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                                                        )}
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Message Input */}
                        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border-t border-gray-800/50 p-4">
                            <div className="flex items-center space-x-2">
                                {/* <button className="p-2 hover:bg-gray-800/50 rounded-lg transition-all">
                                    <Paperclip className="h-5 w-5 text-gray-400 hover:text-emerald-400" />
                                </button> */}

                                <div className="flex-1 relative">
                                    <textarea
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type a message..."
                                        rows={1}
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition-all resize-none"
                                    />
                                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-700/50 rounded-lg transition-all">
                                        <Smile className="h-5 w-5 text-gray-400 hover:text-yellow-400" />
                                    </button>
                                </div>

                                <button
                                    onClick={handleSendMessage}
                                    disabled={!messageInput.trim()}
                                    className="p-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 rounded-xl transition-all transform hover:scale-105 disabled:scale-100"
                                >
                                    <Send className="h-5 w-5 text-white" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    /* No Chat Selected */
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package className="h-10 w-10 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-300">Select a conversation</h3>
                            <p className="text-gray-500">Choose a seller to start chatting about their products</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

function EmptyMessage() {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon" className='bg-black'>
                    <MessageCircleDashed className='text-white' />
                </EmptyMedia>
                <EmptyTitle>No Messages Yet</EmptyTitle>
                <EmptyDescription>
                    You haven&apos;t had any conversation yet. <br />Get started by sending
                    your first message.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className="flex gap-2">

                </div>
            </EmptyContent>

        </Empty>
    )
}

export default Chat;