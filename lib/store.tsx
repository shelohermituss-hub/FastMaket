"use client";

import React, { createContext, useContext, useReducer, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Transaction {
  id: string;
  logo: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  timestamp: number;
  status: "completed" | "pending" | "canceled";
  cardId?: string;
  note?: string;
}

export interface Card {
  id: string;
  brand: "VISA" | "MC" | "AMEX";
  last4: string;
  holder: string;
  expiry: string;
  balance: number;
  gradient: string;
  flag: string;
  number: string;
  cvv: string;
  type: "Credit" | "Debit" | "Savings";
  isDefault: boolean;
}

export interface Contact {
  id: string;
  name: string;
  initials: string;
  color: string;
  phone: string;
  accountNumber: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
  type: "transfer" | "receive" | "alert" | "promo";
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  faceId: boolean;
  notificationsEnabled: boolean;
  currency: string;
  language: string;
}

export interface AppState {
  user: User;
  totalBalance: number;
  cards: Card[];
  transactions: Transaction[];
  contacts: Contact[];
  notifications: Notification[];
  activeCardId: string;
}

// ─── Actions ──────────────────────────────────────────────────────────────────
export type Action =
  | { type: "TRANSFER";     to: string; amount: number; note?: string; cardId?: string }
  | { type: "RECEIVE";      from: string; amount: number; cardId?: string }
  | { type: "ADD_CARD";     card: Omit<Card,"id"|"isDefault"> }
  | { type: "REMOVE_CARD";  cardId: string }
  | { type: "SET_DEFAULT_CARD"; cardId: string }
  | { type: "UPDATE_USER";  patch: Partial<User> }
  | { type: "MARK_ALL_READ" }
  | { type: "ADD_NOTIFICATION"; n: Omit<Notification,"id"|"timestamp"|"read"> }
  | { type: "SET_ACTIVE_CARD"; cardId: string }
  | { type: "ADD_MONEY";    amount: number; cardId?: string }
  | { type: "WITHDRAW";     amount: number; cardId?: string }
  | { type: "ADD_CONTACT";  contact: Omit<Contact,"id"> }
  | { type: "REMOVE_CONTACT"; contactId: string };

// ─── Initial State ────────────────────────────────────────────────────────────
const now = Date.now();
const day = 86_400_000;

const INITIAL_STATE: AppState = {
  user: {
    firstName: "Michael",
    lastName: "Anthony",
    email: "michaelanthony@mail.com",
    phone: "212-456-7890",
    address: "Mountain View, California",
    avatar: "MA",
    faceId: true,
    notificationsEnabled: true,
    currency: "USD",
    language: "English",
  },
  totalBalance: 40568.00,
  activeCardId: "card-1",
  cards: [
    {
      id: "card-1", brand:"VISA", last4:"5633", holder:"Michael Anthony",
      expiry:"01/25", balance:20284.00, cvv:"123", type:"Debit",
      gradient:"linear-gradient(135deg,#5B4FFF,#9B8FFF)", flag:"🇺🇸",
      number:"2507 5645 6685 5633", isDefault:true,
    },
    {
      id: "card-2", brand:"MC", last4:"1234", holder:"Michael Anthony",
      expiry:"03/26", balance:12568.00, cvv:"456", type:"Credit",
      gradient:"linear-gradient(135deg,#374151,#1A1A1A)", flag:"🇩🇪",
      number:"4012 3456 7890 1234", isDefault:false,
    },
    {
      id: "card-3", brand:"VISA", last4:"5633", holder:"Michael Anthony",
      expiry:"01/25", balance:7716.00, cvv:"789", type:"Savings",
      gradient:"linear-gradient(135deg,#F59E0B,#D97706)", flag:"🇬🇧",
      number:"2507 5645 6685 5633", isDefault:false,
    },
  ],
  contacts: [
    { id:"c1", name:"Michael", initials:"MK", color:"#5B4FFF", phone:"+1 212 555 0101", accountNumber:"****1234" },
    { id:"c2", name:"Olivia",  initials:"OL", color:"#F59E0B", phone:"+1 212 555 0102", accountNumber:"****5678" },
    { id:"c3", name:"James",   initials:"JM", color:"#10B981", phone:"+1 212 555 0103", accountNumber:"****9012" },
    { id:"c4", name:"Sarah",   initials:"SA", color:"#EF4444", phone:"+1 212 555 0104", accountNumber:"****3456" },
  ],
  transactions: [
    { id:"t1",  logo:"visa",    name:"Transfer to *5527",   category:"Transfer",   amount:-80,    date:"Today, 14:22",       timestamp:now-1*3600000,  status:"completed", cardId:"card-1" },
    { id:"t2",  logo:"paypal",  name:"Receive From PayPal", category:"Income",     amount:+1200,  date:"Today, 09:15",       timestamp:now-5*3600000,  status:"completed" },
    { id:"t3",  logo:"person",  name:"Transfer to Olivia",  category:"Transfer",   amount:-80,    date:"Yesterday, 17:00",   timestamp:now-1*day,      status:"completed", cardId:"card-1" },
    { id:"t4",  logo:"person",  name:"Transfer to James",   category:"Transfer",   amount:-900,   date:"20 Nov, 10:00",      timestamp:now-3*day,      status:"canceled",  cardId:"card-1" },
    { id:"t5",  logo:"netflix", name:"Netflix",             category:"Streaming",  amount:-29,    date:"20 Nov, 09:45",      timestamp:now-3*day-1000, status:"completed", cardId:"card-2" },
    { id:"t6",  logo:"amazon",  name:"Amazon",              category:"Shopping",   amount:-89.99, date:"3 Sep, 14:22",       timestamp:now-10*day,     status:"completed", cardId:"card-1" },
    { id:"t7",  logo:"person",  name:"Receive From Bank",   category:"Income",     amount:+1500,  date:"3 Sep, 10:00",       timestamp:now-10*day+1,   status:"completed" },
    { id:"t8",  logo:"spotify", name:"Spotify",             category:"Streaming",  amount:-9.99,  date:"1 Mar, 00:00",       timestamp:now-20*day,     status:"completed", cardId:"card-2" },
    { id:"t9",  logo:"meta",    name:"Meta Ads",            category:"Business",   amount:-60,    date:"28 Feb, 11:00",      timestamp:now-25*day,     status:"completed", cardId:"card-1" },
    { id:"t10", logo:"paypal",  name:"Receive From PayPal", category:"Income",     amount:+3200,  date:"15 Feb, 09:00",      timestamp:now-40*day,     status:"completed" },
  ],
  notifications: [
    { id:"n1", title:"Transfer Successful",   body:"You sent $80 to Olivia",       timestamp:now-1*3600000, read:false, type:"transfer" },
    { id:"n2", title:"Money Received",        body:"You received $1200 from PayPal",timestamp:now-5*3600000, read:false, type:"receive"  },
    { id:"n3", title:"Low Balance Alert",     body:"Card *5527 balance below $500", timestamp:now-1*day,    read:true,  type:"alert"    },
    { id:"n4", title:"New Offer Available",   body:"Order your free debit card!",   timestamp:now-2*day,    read:true,  type:"promo"    },
  ],
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
function uid() { return Math.random().toString(36).slice(2); }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {

    case "TRANSFER": {
      const amt = Math.abs(action.amount);
      if (amt > state.totalBalance) return state;
      const card = state.cards.find(c=>c.id===(action.cardId||state.activeCardId));
      const newTx: Transaction = {
        id: uid(), logo:"person", name:`Transfer to ${action.to}`,
        category:"Transfer", amount:-amt,
        date: "Just now", timestamp: Date.now(),
        status:"completed", cardId: action.cardId||state.activeCardId,
        note: action.note,
      };
      const notif: Notification = {
        id: uid(), title:"Transfer Successful",
        body:`You sent $${amt.toFixed(2)} to ${action.to}`,
        timestamp: Date.now(), read:false, type:"transfer",
      };
      return {
        ...state,
        totalBalance: +(state.totalBalance - amt).toFixed(2),
        cards: state.cards.map(c=>
          c.id===(action.cardId||state.activeCardId)
            ? { ...c, balance:+(c.balance-amt).toFixed(2) }
            : c
        ),
        transactions: [newTx, ...state.transactions],
        notifications: [notif, ...state.notifications],
      };
    }

    case "ADD_MONEY": {
      const amt = Math.abs(action.amount);
      const newTx: Transaction = {
        id: uid(), logo:"paypal", name:"Money Added",
        category:"Income", amount:+amt,
        date:"Just now", timestamp:Date.now(),
        status:"completed", cardId:action.cardId||state.activeCardId,
      };
      const notif: Notification = {
        id:uid(), title:"Money Added",
        body:`$${amt.toFixed(2)} added to your account`,
        timestamp:Date.now(), read:false, type:"receive",
      };
      return {
        ...state,
        totalBalance: +(state.totalBalance+amt).toFixed(2),
        cards: state.cards.map(c=>
          c.id===(action.cardId||state.activeCardId)
            ? { ...c, balance:+(c.balance+amt).toFixed(2) }
            : c
        ),
        transactions: [newTx, ...state.transactions],
        notifications: [notif, ...state.notifications],
      };
    }

    case "WITHDRAW": {
      const amt = Math.abs(action.amount);
      if (amt > state.totalBalance) return state;
      const newTx: Transaction = {
        id:uid(), logo:"visa", name:"Withdrawal",
        category:"Transfer", amount:-amt,
        date:"Just now", timestamp:Date.now(),
        status:"completed", cardId:action.cardId||state.activeCardId,
      };
      return {
        ...state,
        totalBalance: +(state.totalBalance-amt).toFixed(2),
        cards: state.cards.map(c=>
          c.id===(action.cardId||state.activeCardId)
            ? { ...c, balance:+(c.balance-amt).toFixed(2) }
            : c
        ),
        transactions: [newTx, ...state.transactions],
      };
    }

    case "RECEIVE": {
      const amt = Math.abs(action.amount);
      const newTx: Transaction = {
        id:uid(), logo:"person", name:`Receive From ${action.from}`,
        category:"Income", amount:+amt,
        date:"Just now", timestamp:Date.now(),
        status:"completed", cardId:action.cardId,
      };
      return {
        ...state,
        totalBalance: +(state.totalBalance+amt).toFixed(2),
        transactions: [newTx, ...state.transactions],
      };
    }

    case "ADD_CARD": {
      const newCard: Card = { ...action.card, id:uid(), isDefault:state.cards.length===0 };
      return { ...state, cards:[...state.cards, newCard] };
    }

    case "REMOVE_CARD": {
      const remaining = state.cards.filter(c=>c.id!==action.cardId);
      const removedBalance = state.cards.find(c=>c.id===action.cardId)?.balance||0;
      return {
        ...state,
        cards: remaining.length>0
          ? remaining.map((c,i)=>i===0?{...c,isDefault:true}:c)
          : remaining,
        totalBalance: +(state.totalBalance - removedBalance).toFixed(2),
        activeCardId: remaining[0]?.id || "",
      };
    }

    case "SET_DEFAULT_CARD":
      return {
        ...state,
        cards: state.cards.map(c=>({...c, isDefault:c.id===action.cardId})),
        activeCardId: action.cardId,
      };

    case "SET_ACTIVE_CARD":
      return { ...state, activeCardId: action.cardId };

    case "UPDATE_USER":
      return { ...state, user:{ ...state.user, ...action.patch } };

    case "MARK_ALL_READ":
      return { ...state, notifications: state.notifications.map(n=>({...n,read:true})) };

    case "ADD_NOTIFICATION": {
      const n: Notification = { ...action.n, id:uid(), timestamp:Date.now(), read:false };
      return { ...state, notifications:[n,...state.notifications] };
    }

    case "ADD_CONTACT": {
      const c: Contact = { ...action.contact, id:uid() };
      return { ...state, contacts:[...state.contacts, c] };
    }

    case "REMOVE_CONTACT":
      return { ...state, contacts: state.contacts.filter(c=>c.id!==action.contactId) };

    default: return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const Ctx = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
  transfer: (to:string, amount:number, note?:string, cardId?:string)=>boolean;
  addMoney: (amount:number, cardId?:string)=>void;
  withdraw: (amount:number, cardId?:string)=>boolean;
  unreadCount: number;
  income: number;
  spending: number;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const transfer = useCallback((to:string, amount:number, note?:string, cardId?:string)=>{
    if (amount <= 0 || amount > state.totalBalance) return false;
    dispatch({ type:"TRANSFER", to, amount, note, cardId });
    return true;
  }, [state.totalBalance]);

  const addMoney = useCallback((amount:number, cardId?:string)=>{
    if (amount <= 0) return;
    dispatch({ type:"ADD_MONEY", amount, cardId });
  }, []);

  const withdraw = useCallback((amount:number, cardId?:string)=>{
    if (amount <= 0 || amount > state.totalBalance) return false;
    dispatch({ type:"WITHDRAW", amount, cardId });
    return true;
  }, [state.totalBalance]);

  const unreadCount = state.notifications.filter(n=>!n.read).length;

  const income   = state.transactions.filter(t=>t.amount>0).reduce((s,t)=>s+t.amount,0);
  const spending = state.transactions.filter(t=>t.amount<0).reduce((s,t)=>s+Math.abs(t.amount),0);

  return (
    <Ctx.Provider value={{ state, dispatch, transfer, addMoney, withdraw, unreadCount, income, spending }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function fmtMoney(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits:2, maximumFractionDigits:2 });
}

export function groupByDate(txs: Transaction[]) {
  const groups: { label:string; txs:Transaction[] }[] = [];
  const nowD = new Date(); nowD.setHours(0,0,0,0);
  const yday = new Date(nowD); yday.setDate(yday.getDate()-1);
  for (const tx of txs) {
    const d = new Date(tx.timestamp); d.setHours(0,0,0,0);
    const label = d.getTime()===nowD.getTime() ? "Today"
      : d.getTime()===yday.getTime() ? "Yesterday"
      : d.toLocaleDateString("en-US",{day:"numeric",month:"long"});
    const g = groups.find(g=>g.label===label);
    if (g) g.txs.push(tx); else groups.push({ label, txs:[tx] });
  }
  return groups;
}
