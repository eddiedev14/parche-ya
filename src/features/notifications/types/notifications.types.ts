//* Body de POST /api/notify-user-joined
export interface NotifyUserJoinedBody {
  planId: string;
}

//* Body de POST /api/notify-message
export interface NotifyMessageBody {
  planId: string;
  text: string;
}

//* Datos que el backend manda en cada notificación
export interface PushData {
  //? "/plan/{id}" o "/plan/{id}/chat"
  route?: string;
}
