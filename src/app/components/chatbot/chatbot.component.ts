import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { GeminiChatbotService, ChatMessage } from '../../shared/services/gemini-chatbot.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-chatbot',
    templateUrl: './chatbot.component.html',
    styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit, OnDestroy, AfterViewChecked {
    @ViewChild('chatContainer') private chatContainer!: ElementRef;
    
    isOpen = false;
    isMinimized = false;
    userMessage = '';
    messages: ChatMessage[] = [];
    isTyping = false;
    
    private chatSubscription?: Subscription;
    private shouldScrollToBottom = false;

    constructor(private chatbotService: GeminiChatbotService) {}

    ngOnInit(): void {
        // Suscribirse al historial de mensajes
        this.chatSubscription = this.chatbotService.chatHistory$.subscribe(
        messages => {
            this.messages = messages;
            this.shouldScrollToBottom = true;
        }
        );
    }

    ngAfterViewChecked(): void {
        if (this.shouldScrollToBottom) {
        this.scrollToBottom();
        this.shouldScrollToBottom = false;
        }
    }

    ngOnDestroy(): void {
        if (this.chatSubscription) {
        this.chatSubscription.unsubscribe();
        }
    }

    /**
     * Alterna la visibilidad del chatbot
     */
    toggleChat(): void {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
        this.isMinimized = false;
        setTimeout(() => this.scrollToBottom(), 100);
        }
    }

    /**
     * Minimiza el chat
     */
    minimizeChat(): void {
        this.isMinimized = !this.isMinimized;
        if (!this.isMinimized) {
        setTimeout(() => this.scrollToBottom(), 100);
        }
    }

    /**
     * Cierra el chatbot
     */
    closeChat(): void {
        this.isOpen = false;
        this.isMinimized = false;
    }

    /**
     * Envía un mensaje al chatbot
     */
    async sendMessage(): Promise<void> {
        const message = this.userMessage.trim();
        
        if (!message) return;

        // Limpiar el campo de entrada
        this.userMessage = '';
        this.isTyping = true;

        try {
        // Enviar mensaje al servicio
        await this.chatbotService.sendMessage(message);
        } catch (error) {
        console.error('Error al enviar mensaje:', error);
        } finally {
        this.isTyping = false;
        }
    }

    /**
     * Maneja el evento de tecla presionada
     */
    onKeyPress(event: KeyboardEvent): void {
        if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        this.sendMessage();
        }
    }

    /**
     * Limpia el historial del chat
     */
    clearChat(): void {
        this.chatbotService.clearHistory();
    }

    /**
     * Scroll automático al final del chat
     */
    private scrollToBottom(): void {
        try {
        if (this.chatContainer) {
            this.chatContainer.nativeElement.scrollTop = 
            this.chatContainer.nativeElement.scrollHeight;
        }
        } catch (err) {
        console.error('Error al hacer scroll:', err);
        }
    }

    /**
     * Preguntas frecuentes predefinidas
     */
    askPredefinedQuestion(question: string): void {
        this.userMessage = question;
        this.sendMessage();
    }
}