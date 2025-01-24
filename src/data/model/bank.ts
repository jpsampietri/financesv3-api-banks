import { APIError } from "../../service/util/apiError.js";
import { HTTPStatus } from "../../service/util/httpStatus.js";
import { Properties } from "../../service/util/properties.js";
import { Account, AccountType, CreditAccount, CurrentAccount, SavingsAccount } from "./account.js";
import { APIMethod, APIResource } from "./apiResource.js";

const prop = Properties.instance;
const banksPath = prop.getProperty('api.banksPath');
const accountsPath = prop.getProperty('api.accountsPath');

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
                        throw new APIError(HTTPStatus.INTERNAL_SERVER_ERROR, `Uknown account type ${a.type}`);
                }
            });
        }
    }

    fillStandardLinks(): void {
        super.fillStandardLinks(banksPath);
        super.addRelatedLink(banksPath, 'related_accounts', APIMethod.GET, accountsPath);
        this.accounts.forEach((a: Account) => { 
            a.fillStandardLinks(accountsPath, `${banksPath}/${this._id}`);
        })
    }
}