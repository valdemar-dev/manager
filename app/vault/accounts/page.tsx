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

    const encryptedUsername = encrypt(target.username.value, vaultKey, iv);
    const encryptedEmail = encrypt(target.email.value, vaultKey, iv);
    const encryptedPassword = encrypt(target.password.value, vaultKey, iv);
    const encryptedService = encrypt(target.service.value, vaultKey, iv);
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

  const handleShowModal = (account: object) => {
    setAccountToEdit(account);

    passwordField.current!.type = "password";
    accountModal.current!.showModal();
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
            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M22 8.29344C22 11.7692 19.1708 14.5869 15.6807 14.5869C15.0439 14.5869 13.5939 14.4405 12.8885 13.8551L12.0067 14.7333C11.4883 15.2496 11.6283 15.4016 11.8589 15.652C11.9551 15.7565 12.0672 15.8781 12.1537 16.0505C12.1537 16.0505 12.8885 17.075 12.1537 18.0995C11.7128 18.6849 10.4783 19.5045 9.06754 18.0995L8.77362 18.3922C8.77362 18.3922 9.65538 19.4167 8.92058 20.4412C8.4797 21.0267 7.30403 21.6121 6.27531 20.5876L5.2466 21.6121C4.54119 22.3146 3.67905 21.9048 3.33616 21.6121L2.45441 20.7339C1.63143 19.9143 2.1115 19.0264 2.45441 18.6849L10.0963 11.0743C10.0963 11.0743 9.3615 9.90338 9.3615 8.29344C9.3615 4.81767 12.1907 2 15.6807 2C19.1708 2 22 4.81767 22 8.29344ZM15.681 10.4889C16.8984 10.4889 17.8853 9.50601 17.8853 8.29353C17.8853 7.08105 16.8984 6.09814 15.681 6.09814C14.4635 6.09814 13.4766 7.08105 13.4766 8.29353C13.4766 9.50601 14.4635 10.4889 15.681 10.4889Z" fill="var(--accent-100)"/>
            </svg>
          </button>
          <button className="rounded-md bg-secondary-300 duration-200 active:bg-secondary-500 sm:hover:bg-secondary-400 p-2" onClick={() => {copy(account.accountUsername)}}>
            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 1C8.96243 1 6.5 3.46243 6.5 6.5C6.5 9.53757 8.96243 12 12 12C15.0376 12 17.5 9.53757 17.5 6.5C17.5 3.46243 15.0376 1 12 1Z" fill="var(--accent-100)"/>
              <path d="M7 14C4.23858 14 2 16.2386 2 19V22C2 22.5523 2.44772 23 3 23H21C21.5523 23 22 22.5523 22 22V19C22 16.2386 19.7614 14 17 14H7Z" fill="var(--accent-100)"/>
            </svg>
          </button>
          <button className="rounded-md bg-secondary-300 duration-200 active:bg-secondary-500 sm:hover:bg-secondary-400 p-2" onClick={() => {copy(account.accountEmail)}}>
            <svg height="20px" width="20px" fill="var(--accent-100)" viewBox="0 0 512 512">
            <g>
              <path stroke="#ffffff" className="st0" d="M440.917,67.925H71.083C31.827,67.925,0,99.752,0,139.008v233.984c0,39.256,31.827,71.083,71.083,71.083
                h369.834c39.255,0,71.083-31.827,71.083-71.083V139.008C512,99.752,480.172,67.925,440.917,67.925z M178.166,321.72l-99.54,84.92
                c-7.021,5.992-17.576,5.159-23.567-1.869c-5.992-7.021-5.159-17.576,1.87-23.567l99.54-84.92c7.02-5.992,17.574-5.159,23.566,1.87
                C186.027,305.174,185.194,315.729,178.166,321.72z M256,289.436c-13.314-0.033-26.22-4.457-36.31-13.183l0.008,0.008l-0.032-0.024
                c0.008,0.008,0.017,0.008,0.024,0.016L66.962,143.694c-6.98-6.058-7.723-16.612-1.674-23.583c6.057-6.98,16.612-7.723,23.582-1.674
                l152.771,132.592c3.265,2.906,8.645,5.004,14.359,4.971c5.706,0.017,10.995-2.024,14.44-5.028l0.074-0.065l152.615-132.469
                c6.971-6.049,17.526-5.306,23.583,1.674c6.048,6.97,5.306,17.525-1.674,23.583l-152.77,132.599
                C282.211,284.929,269.322,289.419,256,289.436z M456.948,404.771c-5.992,7.028-16.547,7.861-23.566,1.869l-99.54-84.92
                c-7.028-5.992-7.861-16.546-1.869-23.566c5.991-7.029,16.546-7.861,23.566-1.87l99.54,84.92
                C462.107,387.195,462.94,397.75,456.948,404.771z"/>
            </g>
          </svg>
          </button>
          <button 
            onClick={() => {handleShowModal(account)}} 
            className="rounded-md bg-secondary-300 duration-200 active:bg-secondary-500 sm:hover:bg-secondary-400 p-2"
          >
            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="m3.99 16.854-1.314 3.504a.75.75 0 0 0 .966.965l3.503-1.314a3 3 0 0 0 1.068-.687L18.36 9.175s-.354-1.061-1.414-2.122c-1.06-1.06-2.122-1.414-2.122-1.414L4.677 15.786a3 3 0 0 0-.687 1.068zm12.249-12.63 1.383-1.383c.248-.248.579-.406.925-.348.487.08 1.232.322 1.934 1.025.703.703.945 1.447 1.025 1.934.058.346-.1.677-.348.925L19.774 7.76s-.353-1.06-1.414-2.12c-1.06-1.062-2.121-1.415-2.121-1.415z" 
                fill="var(--accent-100)"
              />  
            </svg>
          </button>
        </div>
      )
    })
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
            <input className="bg-primary-200 focus:bg-primary-300 duration-200 text-primary-text text-lg px-3 py-1 placeholder-primary-text rounded-md w-full mb-2" type="text" name="username" placeholder="username"/>
            <span className="text-sm">Email address</span>
            <input className="bg-primary-200 focus:bg-primary-300 duration-200 text-primary-text text-lg px-3 py-1 placeholder-primary-text rounded-md w-full mb-2" type="email" name="email" placeholder="email"/>
            <span className="text-sm">Password</span>
            <input className="bg-primary-200 focus:bg-primary-300 duration-200 text-primary-text text-lg px-3 py-1 placeholder-primary-text rounded-md w-full mb-2" required type="password" name="password" placeholder="password"/>
            <span className="text-sm">Service</span>
            <input className="bg-primary-200 focus:bg-primary-300 duration-200 text-primary-text text-lg px-3 py-1 placeholder-primary-text rounded-md w-full mb-2" required type="text" name="service" placeholder="service"/>

            <p className="mt-2">You might need to refresh your page to see changes take affect.</p>

            <button className="bg-primary-200 active:bg-primary-400 sm:hover:bg-primary-300 transition-all duration-200 text-primary-text text-lg px-3 py-1 rounded-md w-full mt-3" type="submit">Add Account</button>
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
              <svg width="22px" height="22px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <title>ionicons-v5-a</title>
                <polyline 
                  points="244 400 100 256 244 112" 
                  style={{"fill":"none","stroke":"var(--accent-100)","strokeLinecap":"round","strokeLinejoin":"round","strokeWidth":"48px"}}
                />
                <line 
                  x1="120" y1="256" x2="412" y2="256" 
                  style={{"fill":"none","stroke":"var(--accent-100)","strokeLinecap":"round","strokeLinejoin":"round","strokeWidth":"48px"}}
                />
              </svg>  
            </button>
            <button className="rounded-md bg-secondary-200 duration-200 active:bg-secondary-400 sm:hover:bg-secondary-300 p-2" onClick={() => {accountsPageNumber === accountsPageMaxIndex ? null : setAccountsPageNumber(accountsPageNumber+1)}}>
              <svg width="22px" height="22px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <title>ionicons-v5-a</title>
                <polyline 
                  points="268 112 412 256 268 400" 
                  style={{"fill":"none","stroke":"var(--accent-100)","strokeLinecap":"round","strokeLinejoin":"round","strokeWidth":"48px"}}
                />
                <line 
                  x1="392" y1="256" x2="100" y2="256" 
                  style={{"fill":"none","stroke":"var(--accent-100)","strokeLinecap":"round","strokeLinejoin":"round","strokeWidth":"48px"}}
                />
              </svg>
            </button> 
          </div>
          <p className="text-sm">Showing page {accountsPageNumber} of {accountsPageMaxIndex}</p>
        </Card>
      </div>

      <dialog ref={accountModal} className="rounded-xl">
        <div className="bg-primary-100 text-primary-text drop-shadow-xl p-4 rounded-xl flex flex-col gap-2 animation-delay-1400">
          <h3 className="text-xl font-semibold mb-2 text-secondary">Edit account</h3>
          <form method="dialog" onSubmit={(event) => {handleAccountEdit(event)}}>
            <span className="text-sm">Username</span>
            <input className="bg-primary-200 focus:bg-primary-300 duration-200 text-primary-text text-lg px-3 py-1 rounded-md w-full mb-2 placeholder-primary-text" name="username" type="username" defaultValue={accountToEdit?.accountUsername} ref={usernameField} placeholder="username"/>
            <span className="text-sm">Email address</span>
            <input className="bg-primary-200 focus:bg-primary-300 duration-200 text-primary-text text-lg px-3 py-1 rounded-md w-full mb-2 placeholder-primary-text" name="email" type="email" defaultValue={accountToEdit?.accountEmail} ref={emailField} placeholder="email"/>
            <span className="text-sm">Password</span>
            <div className="flex gap-2">
              <input className="bg-primary-200 focus:bg-primary-300 duration-200 text-primary-text text-lg px-3 py-1 rounded-md w-full mb-2 placeholder-primary-text" name="password" required type="password" defaultValue={accountToEdit?.accountPassword} ref={passwordField} placeholder="password"/>
              <a className="rounded-md bg-primary-200 duration-200 active:bg-primary-400 sm:hover:bg-primary-300 p-2 mb-2 flex justify-center items-center" onClick={() => {togglePasswordVisibility()}}>
              <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="var(--secondary-100)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="var(--secondary-100)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              </a>
            </div>
            <span className="text-sm">Service</span>
            <input className="bg-primary-200 focus:bg-primary-300 duration-200 text-primary-text text-lg px-3 py-1 rounded-md w-full mb-2 placeholder-primary-text" name="service" required type="service" defaultValue={accountToEdit?.accountService} ref={serviceField} placeholder="service"/>

            <p className="mt-2 unobstructive">You might need to refresh your page to see changes take affect.</p>

            <div className="flex gap-2">
              <button className="bg-primary-200 text-primary-text active:bg-primary-400 sm:hover:bg-primary-300 duration-200 text-lg px-3 py-1 rounded-md w-full mt-3" type="submit">Save</button>
              <button className="bg-secondary-200 text-text active:bg-secondary-400 sm:hover:bg-secondary-300 duration-200 text-lg px-3 py-1 rounded-md w-full mt-3" type="reset">Revert</button>
            </div>
          </form>
        </div>
      </dialog>

      <dialog ref={infoModal} className="rounded-xl w-96 fadeIn delay-0">
        <div className="bg-secondary-100 text-primary-text drop-shadow-xl p-4 rounded-xl flex flex-col gap-2">
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