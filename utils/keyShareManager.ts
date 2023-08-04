class KeyShareManager {
  keys: Array<any>;

  constructor() {
    this.keys = [];
  }

  addKey(key: string, authToken: string) {
    const date = Date.now();

    this.keys.push({
      key: key,
      authToken: authToken,
      expiresAt: date + 3600000,
    });
  }

  getKey(authToken: string) {
    const key = this.keys.find(k => k.authToken === authToken);

    if (!key) {
      return false;
    }
    
    if (key.expiresAt <= Date.now()) {
      this.keys.splice(this.keys.indexOf(key));
      return false;
    }

    this.keys.splice(this.keys.indexOf(key));

    return key;
  }
}

let keyShareManager: any;

declare global {
  var keyShareManager: KeyShareManager;
}

if (process.env.NODE_ENV === "production") {
  keyShareManager = new KeyShareManager()
} else {
  if (!global.keyShareManager) {
    global.keyShareManager = new KeyShareManager()
  }

  keyShareManager = global.keyShareManager
}

export default keyShareManager