const { google } = require('googleapis')

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URL, REFRESH_TOKEN } = process.env

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID, CLIENT_SECRET, REDIRECT_URL
)

oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
})

console.log({CLIENT_ID, CLIENT_SECRET, REDIRECT_URL, REFRESH_TOKEN})

export async function uploadFile(uploadName, fsReadStreamOfFilePath){
    try{
        console.log("uploading")

        const response = await drive.files.create({
            requestBody: {
                name: uploadName, // name that we gonna save to Onedrive
                mimeType: 'image/png',
                parents: ["1ljulA5PkZVr-R2iL3Pq0dsw4q1HEsJQW"]
            },
            media: { // actual content of our file
                mimeType: 'image/png',
                body: fsReadStreamOfFilePath
            }
        })

        console.log(response.data)

    }catch(err){
        console.log(err.message)
    }
}