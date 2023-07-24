# ManagerX
Full-stack account management system.

## Getting Started
Set the `.env` database url and `prisma.schema` database provider and language accordingly to whichever database you're using.
<br>
Run ```npm install --save && npm run dev```.

## Utils

| Util     | Input   | Output        |
| -------- | ------- | -------       |
| hashText | `string`| `sha256 hash` | 
| getSession | `sessionId` | `session object` |