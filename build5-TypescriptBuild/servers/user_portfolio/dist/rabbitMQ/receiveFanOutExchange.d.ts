import type { MatchedOrder } from "../interfaces/interfaces";
declare const receiveFanOutExchange: (exchangeName: string, queueName: string, callback: (message: MatchedOrder) => void) => Promise<void>;
export { receiveFanOutExchange };
