import { Properties } from "../../service/util/properties.js";
import { Account, AccountType, CreditAccount, CurrentAccount, SavingsAccount } from "./account.js";
import { APIMethod, APIResource } from "./apiResource.js";

const prop = Properties.instance;
const resourcePath = prop.getProperty('api.resourcePath');

export class Bank extends APIResource {
    label: string;
    color: string;
    accounts: Account[];

    constructor(object: any) {
        super(object?._id);
        this.label = object.label;
        this.color = object.color;
        this.accounts = [];
        if (object.accounts) {
            object.accounts.forEach((a: any) => {
                let account;
                switch (a.type) {
                    case AccountType.CURRENT.toString():
                        account = new CurrentAccount(a);
                        this.accounts.push(account);
                        break;
                    case AccountType.CREDIT.toString():
                        account = new CreditAccount(a);
                        this.accounts.push(account);
                        break;
                    case AccountType.SAVINGS.toString():
                        account = new SavingsAccount(a);
                        this.accounts.push(account);
                        break;

                    default:
                        break;
                }
            });
        }
    }

    fillStandardLinks(): void {
        super.fillStandardLinks(resourcePath);
        super.addRelatedLink('/banks', 'related_accounts', APIMethod.GET, '/accounts');
        this.accounts.forEach((a: Account) => { 
            a.fillStandardLinks('/accounts', `/banks/${this._id}`);
        })
    }
}