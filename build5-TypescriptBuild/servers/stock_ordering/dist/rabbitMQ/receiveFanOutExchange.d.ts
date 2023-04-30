import type { MatchedOrder } from "../interface/interface";
declare const receiveFanOutExchange: (exchangeName: string, queueName: string, callback: (message: MatchedOrder) => void) => Promise<void>;
export { receiveFanOutExchange };
