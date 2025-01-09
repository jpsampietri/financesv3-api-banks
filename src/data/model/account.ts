import { APIResource } from "./apiResource.js";

export enum AccountType {
    CURRENT = "CURRENT",
    CREDIT = "CREDIT",
    SAVINGS = "SAVINGS"
}

export class Account extends APIResource{
    label: string;
    letter: string;
    limit: number;
    availableLimit: number;
    type: AccountType;

    constructor(object: any) {
        super(object._id);
        this.label = object.label;
        this.letter = object.letter;
        this.limit = object.limit;
        this.availableLimit = object.availableLimit;
        this.type = object.type;
    }
}

export class CurrentAccount extends Account{
    balance: number;

    constructor(object: any) {
        super(object);
        this.balance = object.balance;
    }
}

export class CreditAccount extends Account{
    closeDay: number;
    dueDay: number;

    constructor(object: any) {
        super(object);
        this.closeDay = object.closeDay;
        this.dueDay = object.dueDay;
    }
}

export class SavingsAccount extends Account{
    balance: number;
    targetAmount: number;
    targetDueDate: Date;

    constructor(object: any) {
        super(object);
        this.balance = object.balance;
        this.targetAmount = object.targetAmount;
        this.targetDueDate = object.targetDueDate;
    }
}
