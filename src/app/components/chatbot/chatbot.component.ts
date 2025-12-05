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
    
    // Propiedades para voz y avatar
    voiceEnabled = true;
    isSpeaking = false;
    private speechSynthesis: SpeechSynthesis;
    private currentUtterance?: SpeechSynthesisUtterance;
    
    private chatSubscription?: Subscription;
    private shouldScrollToBottom = false;

    constructor(private chatbotService: GeminiChatbotService) {
        this.speechSynthesis = window.speechSynthesis;
    }

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
        // Detener voz al destruir componente
        this.stopSpeaking();
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
        const response = await this.chatbotService.sendMessage(message);
        
        // Leer respuesta en voz alta si está habilitado
        if (this.voiceEnabled && response) {
            this.speak(response);
        }
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

    /**
     * Activa/desactiva la voz del asistente
     */
    toggleVoice(): void {
        this.voiceEnabled = !this.voiceEnabled;
        if (!this.voiceEnabled) {
        this.stopSpeaking();
        }
    }

    /**
     * Lee un texto en voz alta
     */
    private speak(text: string): void {
        // Detener cualquier voz en curso
        this.stopSpeaking();

        // Limpiar emojis y caracteres especiales para mejor síntesis
        const cleanText = text.replace(/[🔑⚠️🌐✅❌📤👋]/g, '').trim();
        
        if (!cleanText) return;

        this.currentUtterance = new SpeechSynthesisUtterance(cleanText);
        
        // Configurar voz en español
        const voices = this.speechSynthesis.getVoices();
        const spanishVoice = voices.find(voice => voice.lang.startsWith('es'));
        if (spanishVoice) {
        this.currentUtterance.voice = spanishVoice;
        }
        
        // Configurar parámetros de voz
        this.currentUtterance.lang = 'es-ES';
        this.currentUtterance.rate = 1.1; // Velocidad
        this.currentUtterance.pitch = 1.0; // Tono
        this.currentUtterance.volume = 1.0; // Volumen

        // Eventos de la voz
        this.currentUtterance.onstart = () => {
        this.isSpeaking = true;
        };

        this.currentUtterance.onend = () => {
        this.isSpeaking = false;
        };

        this.currentUtterance.onerror = () => {
        this.isSpeaking = false;
        console.error('Error en síntesis de voz');
        };

        // Reproducir voz
        this.speechSynthesis.speak(this.currentUtterance);
    }

    /**
     * Detiene la voz actual
     */
    private stopSpeaking(): void {
        if (this.speechSynthesis.speaking) {
        this.speechSynthesis.cancel();
        }
        this.isSpeaking = false;
    }
}