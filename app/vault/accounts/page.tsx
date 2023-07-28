"use client";

import crypto from "crypto";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import copy from "copy-to-clipboard";
import Link from "next/link";
import Divider from "@/components/Divider";
import Card from "@/components/CardComponent";

export default function Accounts() {
  const router = useRouter();

  const infoModal = useRef<any>();
  const [infoText, setInfoText] = useState<string>("");

  const [accountToEdit, setAccountToEdit] = useState<any>(null);

  const [accounts, setAccounts] = useState<any[]>([]);
  const [accountsPageNumber, setAccountsPageNumber] = useState<number>(1);
  const [accountsPageMaxIndex, setAccountsPageMaxIndex] = useState<number>(1);

  const passwordField = useRef<HTMLInputElement>(null);
  const usernameField = useRef<HTMLInputElement>(null);
  const emailField = useRef<HTMLInputElement>(null);
  const serviceField = useRef<HTMLInputElement>(null);

  const accountModal = useRef<any>(null);

  const encrypt = (text: string, key: string, iv: Buffer) => {
    let cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(key), iv);

    let encryptedText = cipher.update(text);
    encryptedText = Buffer.concat([encryptedText, cipher.final()]);

    const tag = cipher.getAuthTag();

    return { encryptedText: encryptedText.toString("hex"), authTag: tag.toString("hex")}
  };

  const decrypt = (encryptedText: string, key: string, iv: string, tag: string) => {
    const encryptedTextBuffer = Buffer.from(encryptedText, "hex");
    
    const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(key), Buffer.from(iv, "hex"));
    decipher.setAuthTag(Buffer.from(tag, "hex"))
    
    let decryptedText = decipher.update(encryptedTextBuffer);
    decryptedText = Buffer.concat([decryptedText, decipher.final()]);

    return decryptedText.toString("utf-8");
  };

  useEffect(() => {
    const vaultKey = sessionStorage.getItem("vaultKey");

    if (!vaultKey) {
      return router.replace("/vault/auth");
    }

    fetch("/api/vault/getAccounts").then(async (response) => {
      if (!response.ok) {
        return router.push("/user/login");
      }

      const res = await response.json();
      
      res.accounts.forEach((account: any) => {
        account.accountUsername = decrypt(account.accountUsername, vaultKey, account.iv, account.usernameAuthTag);
        account.accountEmail = decrypt(account.accountEmail, vaultKey, account.iv, account.emailAuthTag);
        account.accountPassword = decrypt(account.accountPassword, vaultKey, account.iv, account.passwordAuthTag);
        account.accountService = decrypt(account.accountService, vaultKey, account.iv, account.serviceAuthTag);
      });
    
      setAccounts(res.accounts);

      const accountsPerPage: number = 5;
      if (res.accounts.length > 0) {
        setAccountsPageMaxIndex(Math.ceil(res.accounts.length / accountsPerPage));
      }
      
    })
  }, []);

  const addAccount = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const iv = crypto.randomBytes(16);

    const target = event.target as typeof event.target & {
      username: { value: string };
      email: { value: string };
      password: { value: string };
      service: { value: string };
    }

    const vaultKey = sessionStorage.getItem("vaultKey")!;

    const encryptedUsername = encrypt(target.username.value, vaultKey, iv)
    const encryptedEmail = encrypt(target.email.value, vaultKey, iv)
    const encryptedPassword = encrypt(target.password.value, vaultKey, iv)
    const encryptedService = encrypt(target.service.value, vaultKey, iv)
    const encryptedCreationTimestamp = encrypt(Date.now().toString(), vaultKey, iv);

    const data = {
      username: encryptedUsername.encryptedText,
      email: encryptedEmail.encryptedText,
      password: encryptedPassword.encryptedText,
      service: encryptedService.encryptedText,
      usernameAuthTag: encryptedUsername.authTag,
      emailAuthTag: encryptedEmail.authTag,
      passwordAuthTag: encryptedPassword.authTag,
      serviceAuthTag: encryptedService.authTag,
      creationTimestamp: encryptedCreationTimestamp.encryptedText,
      creationTimestampAuthTag: encryptedCreationTimestamp.authTag,
      iv: iv.toString("hex"),
    }

    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch("/api/vault/createAccount", options).then(async (response) => {
      setInfoText(await response.text());

      return infoModal.current!.showModal();
    })
  };

  const mapAccounts = () => {
    if (accounts.length < 1) {
      return (
        <div>No accounts found.</div>
      )
    }

    const accountsPerPage: number = 5;

    const maxIndex = accountsPageNumber * accountsPerPage -1;
    const minIndex = maxIndex - accountsPerPage +1

    const sortedAccounts = accounts.sort((a,b) => {return a.creationTimestamp - b.creationTimestamp});

    const filteredAccounts = sortedAccounts.filter((account, index) => {
      if (
        index < minIndex ||
        index > maxIndex
      ) return false;

      return true;
    });

    return filteredAccounts.map((account, index) => {
      return (
        <div className="flex-grow flex items-center gap-2 bg-secondary-200 px-3 py-2 rounded-lg" key={account.id}>
          <span className="mr-auto text-lg">{account.accountService}</span> 
          <button className="rounded-md bg-secondary-300 duration-200 active:bg-secondary-500 sm:hover:bg-secondary-400 p-2" onClick={() => {copy(account.accountPassword)}}>
            <Image src={"/password.svg"} height={"18"} width={"18"} alt={"password icon"}/>
          </button>
          <button className="rounded-md bg-secondary-300 duration-200 active:bg-secondary-500 sm:hover:bg-secondary-400 p-2" onClick={() => {copy(account.accountUsername)}}>
            <Image src={"/username.svg"} height={"18"} width={"18"} alt={"username icon"}/>
          </button>
          <button className="rounded-md bg-secondary-300 duration-200 active:bg-secondary-500 sm:hover:bg-secondary-400 p-2" onClick={() => {copy(account.accountEmail)}}>
            <Image src={"/email.svg"} height={"18"} width={"18"} alt={"email icon"}/>
          </button>
          <button className="rounded-md bg-secondary-300 duration-200 active:bg-secondary-500 sm:hover:bg-secondary-400 p-2" onClick={() => {handleShowModal(account)}}>
            <Image src={"/edit.svg"} height={"18"} width={"18"} alt={"edit icon"}/>
          </button>
        </div>
      )
    })
  };

  const handleShowModal = (account: object) => {
    setAccountToEdit(account);

    passwordField.current!.type = "password";
    accountModal.current!.showModal();
  };

  const handleAccountEdit = (event: FormEvent) => {
    event.preventDefault();

    const iv = crypto.randomBytes(16);

    const vaultKey = sessionStorage.getItem("vaultKey")!;

    const encryptedUsername = encrypt(usernameField.current!.value, vaultKey, iv)
    const encryptedEmail = encrypt(emailField.current!.value, vaultKey, iv)
    const encryptedPassword = encrypt(passwordField.current!.value, vaultKey, iv)
    const encryptedService = encrypt(serviceField.current!.value, vaultKey, iv)

    const data = {
      username: encryptedUsername.encryptedText,
      email: encryptedEmail.encryptedText,
      password: encryptedPassword.encryptedText,
      service: encryptedService.encryptedText,
      usernameAuthTag: encryptedUsername.authTag,
      emailAuthTag: encryptedEmail.authTag,
      passwordAuthTag: encryptedPassword.authTag,
      serviceAuthTag: encryptedService.authTag,
      id: accountToEdit.id,
      iv: iv.toString("hex"),
    }

    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch("/api/vault/editAccount", options);

    accountModal!.current.close();
  };

  const togglePasswordVisibility = () => {
    passwordField.current!.type === "password" ? 
      passwordField.current!.type = "text" :
        passwordField.current!.type = "password";
  };

  return (
    <>
      <div>
        <h1 className="text-4xl font-semibold fadeIn animation-delay-400">Accounts</h1>
        <p className="fadeIn animation-delay-800">Google, Spotify, Twitter etc.</p>
      </div>

      <Divider height="h-10"/>

      <div className="grid md:grid-cols-2 gap-10">
        <Card
          title="Create"
          type="primary"
          animationDelay="animation-delay-1000"
        >
          <form className="mt-2" onSubmit={async (event) => {addAccount(event)}}>
            <span className="text-sm">Username</span>
            <input className="bg-primary-200 focus:bg-primary-300 duration-200 text-primary-text text-lg px-3 py-1 rounded-md w-full mb-2" type="text" name="username" placeholder="username"/>
            <span className="text-sm">Email address</span>
            <input className="bg-primary-200 focus:bg-primary-300 duration-200 text-primary-text text-lg px-3 py-1 rounded-md w-full mb-2" type="email" name="email" placeholder="email"/>
            <span className="text-sm">Password</span>
            <input className="bg-primary-200 focus:bg-primary-300 duration-200 text-primary-text text-lg px-3 py-1 rounded-md w-full mb-2" required type="password" name="password" placeholder="password"/>
            <span className="text-sm">Service</span>
            <input className="bg-primary-200 focus:bg-primary-300 duration-200 text-primary-text text-lg px-3 py-1 rounded-md w-full mb-2" required type="text" name="service" placeholder="service"/>

            <p className="mt-2">You might need to refresh your page to see changes take affect.</p>

            <button className="bg-primary-200 active:bg-secondary-darker sm:hover:bg-secondary transition-all duration-200 text-primary-text text-lg px-3 py-1 rounded-md w-full mt-3" type="submit">Add Account</button>
          </form>
        </Card>

        {/* accounts list */}
        <Card
          title="Accounts"
          type="secondary"
          animationDelay="animation-delay-1200"
        >          
          <p className="mb-2">{accounts.length} account(s) found.</p>
          {mapAccounts()}
          <div className="flex gap-2 flex-row mt-2">
            <button className="rounded-md bg-secondary-200 duration-200 active:bg-secondary-400 sm:hover:bg-secondary-300 p-2" onClick={() => {accountsPageNumber === 1 ? null : setAccountsPageNumber(accountsPageNumber-1)}}>
              <Image src={"/arrow-backward.svg"} height={"18"} width={"18"} alt={"back page button"}/>
            </button>
            <button className="rounded-md bg-secondary-200 duration-200 active:bg-secondary-400 sm:hover:bg-secondary-300 p-2" onClick={() => {accountsPageNumber === accountsPageMaxIndex ? null : setAccountsPageNumber(accountsPageNumber+1)}}>
              <Image src={"/arrow-forward.svg"} height={"18"} width={"18"} alt={"next page button"}/>
            </button> 
          </div>
          <p className="text-sm">Showing page {accountsPageNumber} of {accountsPageMaxIndex}</p>
        </Card>
      </div>

      <dialog ref={accountModal} className="rounded-xl">
        <div className="bg-secondary-100 text-text drop-shadow-xl p-4 rounded-xl flex flex-col gap-2 animation-delay-1400">
          <h3 className="text-xl font-semibold mb-2 text-secondary">Edit account</h3>
          <form method="dialog" onSubmit={(event) => {handleAccountEdit(event)}}>
            <span className="text-sm">Username</span>
            <input className="bg-secondary-200 focus:bg-secondary-300 duration-200 text-text text-lg px-3 py-1 rounded-md w-full mb-2" name="username" type="username" defaultValue={accountToEdit?.accountUsername} ref={usernameField} placeholder="username"/>
            <span className="text-sm">Email address</span>
            <input className="bg-secondary-200 focus:bg-secondary-300 duration-200 text-text text-lg px-3 py-1 rounded-md w-full mb-2" name="email" type="email" defaultValue={accountToEdit?.accountEmail} ref={emailField} placeholder="email"/>
            <span className="text-sm">Password</span>
            <div className="flex gap-2">
              <input className="bg-secondary-200 focus:bg-secondary-300 duration-200 text-text text-lg px-3 py-1 rounded-md w-full mb-2" name="password" required type="password" defaultValue={accountToEdit?.accountPassword} ref={passwordField} placeholder="password"/>
              <a className="rounded-md bg-secondary-200 duration-200 active:bg-secondary-400 sm:hover:bg-secondary-300 p-2 mb-2 flex justify-center items-center" onClick={() => {togglePasswordVisibility()}}>
                <Image src={"/eye-open.svg"} height={"22"} width={"22"} alt={"eye open icon"}/>
              </a>
            </div>
            <span className="text-sm">Service</span>
            <input className="bg-secondary-200 focus:bg-secondary-300 duration-200 text-text text-lg px-3 py-1 rounded-md w-full mb-2" name="service" required type="service" defaultValue={accountToEdit?.accountService} ref={serviceField} placeholder="service"/>

            <p className="mt-2 text-secondary">You might need to refresh your page to see changes take affect.</p>

            <div className="flex gap-2">
              <button className="bg-primary-100 text-primary-text active:bg-primary-300 sm:hover:bg-primary-200 duration-200 text-lg px-3 py-1 rounded-md w-full mt-3" type="submit">Save</button>
              <button className="bg-secondary-200 active:bg-secondary-400 sm:hover:bg-secondary-300 duration-200 text-lg px-3 py-1 rounded-md w-full mt-3" type="reset">Revert</button>
            </div>
          </form>
        </div>
      </dialog>

      <dialog ref={infoModal} className="rounded-xl w-96 fadeIn delay-0">
        <div className="bg-secondary-100 text-text drop-shadow-xl p-4 rounded-xl flex flex-col gap-2">
          <div className="flex items-start flex-row gap-1">
            <h3 className="text-2xl font-semibold">Info</h3>
            <form method="dialog" className="flex ml-auto">
              <button className="rounded-md bg-secondary-200 duration-200 active:bg-secondary-400 sm:hover:bg-secondary-300 p-1">
                <Image src={"/close.svg"} height={"20"} width={"20"} alt={"close icon"} className="fill-secondary"/>
              </button>              
            </form>
          </div>

          <p className="text-secondary text-lg rounded-lg">{infoText}</p>
        </div>
      </dialog>
    </>
  )
}