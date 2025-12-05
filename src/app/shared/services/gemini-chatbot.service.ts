import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ChatMessage {
    role: 'user' | 'bot';
    content: string;
    timestamp: Date;
}

@Injectable({
    providedIn: 'root'
})
export class GeminiChatbotService {
    private genAI: GoogleGenerativeAI;
    private model: any;
    private chatHistory: ChatMessage[] = [];
    private chatHistorySubject = new BehaviorSubject<ChatMessage[]>([]);
    public chatHistory$ = this.chatHistorySubject.asObservable();

  // Contexto del sistema para el chatbot
    private readonly SYSTEM_CONTEXT = `
Eres un asistente virtual inteligente para una plataforma de gestión de domicilios en motocicleta.

INFORMACIÓN DEL SISTEMA:
- Es una plataforma web que conecta restaurantes, clientes, conductores y operadores logísticos
- Permite gestionar pedidos de comida que se entregan en motocicleta
- Los restaurantes pueden ofrecer productos en sus menús
- Los clientes realizan pedidos que son asignados a conductores en moto
- Se pueden registrar inconvenientes durante las entregas (accidentes, fallas mecánicas, etc.)

FUNCIONALIDADES PRINCIPALES:
1. CRUD de Restaurantes - Módulo de gestión de restaurantes
2. CRUD de Productos - Gestión de productos alimenticios
3. CRUD de Menús - Asociación de productos con restaurantes
4. CRUD de Clientes - Gestión de clientes
5. CRUD de Pedidos - Gestión de órdenes de comida
6. CRUD de Conductores - Gestión de repartidores
7. CRUD de Motos - Gestión de vehículos
8. CRUD de Turnos - Asignación de conductores a motos
9. Mapa en tiempo real - Visualización de ubicación de motos
10. Notificaciones - Alertas de nuevos pedidos con sonido
11. Gráficos estadísticos - Análisis de pedidos, ventas, entregas

NAVEGACIÓN:
- Dashboard: Página principal con resumen
- Gestión: Módulo con todos los CRUDs (clientes, conductores, productos, restaurantes, menús, pedidos, motos, turnos)
- Gráficas: Página con 9 gráficos (circulares, barras, series temporales)
- Mapa: Visualización de motos en tiempo real
- Perfil de usuario: Configuración de cuenta

RESPONDE de manera amigable, clara y concisa. Si te preguntan dónde hacer algo, indica la ruta exacta del menú.
`;

constructor() {
    this.genAI = new GoogleGenerativeAI(environment.geminiApiKey);
    // Intentar con diferentes modelos disponibles
    this.model = this.genAI.getGenerativeModel({ 
        model: 'models/gemini-pro',
        generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
    }
    });
    
    // Mensaje de bienvenida del chatbot
    this.addBotMessage('¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?');
}

/**
   * Para enviar un mensaje al chatbot y obtiene una respuesta
   */
async sendMessage(userMessage: string): Promise<string> {
    try {
      // Agregar mensaje del usuario al historial
        this.addUserMessage(userMessage);

      // Verificar que la API Key esté configurada
        if (!environment.geminiApiKey || environment.geminiApiKey === 'TU_GEMINI_API_KEY_AQUI') {
            const errorMessage = 'Por favor configura tu API Key de Gemini en environment.ts';
            this.addBotMessage(errorMessage);
            return errorMessage;
        }

      // Construir el prompt con contexto
        const prompt = `${this.SYSTEM_CONTEXT}\n\nUsuario: ${userMessage}\nAsistente:`;

        console.log('API Key configurada:', environment.geminiApiKey.substring(0, 10) + '...');
        console.log('Enviando mensaje a Gemini API v1beta...');

      // Usar API v1beta con gemini-2.6 - flash
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${environment.geminiApiKey}`;
        
        const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                text: prompt
            }]
            }],
            generationConfig: {
                temperature: 0.9,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
            }
        })
        });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const botMessage = data.candidates[0].content.parts[0].text;

    console.log('Respuesta recibida de Gemini');

    // Agregar respuesta del cchatbot al historial
    this.addBotMessage(botMessage);

    return botMessage;
        } catch (error: any) {
        console.error('Error detallado al comunicarse con Gemini:', error);
        console.error('Tipo de error:', error?.message);
        console.error('Error completo:', JSON.stringify(error, null, 2));

        let errorMessage = 'Lo siento, tuve un problema al procesar tu mensaje.';

      // Mensajes de error más específicos
    if (error?.message?.includes('API key')) {
        errorMessage = 'Error: La API Key no es válida. Verifica tu configuración.';
    } else if (error?.message?.includes('quota')) {
        errorMessage = 'Se ha excedido la cuota de la API. Intenta más tarde.';
    } else if (error?.message?.includes('fetch') || error?.message?.includes('HTTP')) {
        errorMessage = 'Error de conexión con Gemini. Verifica la configuración.';
    }
    
    this.addBotMessage(errorMessage);
    return errorMessage;
    }
}

/**
   * Agrega un mensaje del usuario al historial
   */
    private addUserMessage(content: string): void {
        const message: ChatMessage = {
            role: 'user',
            content: content,
            timestamp: new Date()
        };
        this.chatHistory.push(message);
        this.chatHistorySubject.next([...this.chatHistory]);
    }

/**
   * Agrega un mensaje del bot al historial
   */
    private addBotMessage(content: string): void {
        const message: ChatMessage = {
            role: 'bot',
            content: content,
            timestamp: new Date()
        };
        this.chatHistory.push(message);
        this.chatHistorySubject.next([...this.chatHistory]);
    }

/**
   * Limpia el historial de chat
   */
    clearHistory(): void {
        this.chatHistory = [];
        this.chatHistorySubject.next([]);
        this.addBotMessage('¡Hola! 👋 Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?');
    }

/**
   * Obtiene el historial completo de chat
   */
    getHistory(): ChatMessage[] {
        return [...this.chatHistory];
    }
}
