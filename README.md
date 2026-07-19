# Official UCGS Maths Society Website

Created by **Hiresh Solanki** • **Aryan Jha** • **2026**

This is the official repository for the Upton Court Grammar School's Maths Society.
Built to host weekly challenges, distribute the newsletter and track the student leaderboards!
Built with the main objective of keeping it 100% free, easy to maintain and easily transferrable to future maintainers & teachers compared to the depecrated 2025 version.

## Core Features

**Microsoft Login** - Secure API based connection
**Challenge of the Week** - Updates for KS3, KS4, KS5 [TO DO]. Students can complete the challenges, gain points, etc.
**Newsletter** - Teachers can upload the newsletters as they wish and all students can view them. Signed in or not.

# Credits & Maintenance Information

This Project is Maintained by Year 12/13 students and to be handed down anually, generally Computer Science head(s).

Created by Hiresh Solanki, Aryan Jha [Email 20solankih@uptoncourtgrammar.org.uk for legacy support/general help!]

## Make someone a teacher

1. Go to the firebase Console (may have to ask Dr. Ioras or the current head of Computer Science) using the Maths Society main account.
2. Navigate to the Firestore database
3. Go to Firebase auth and find the teacher you're looking for and copy the UUID (User ID)
4. Open "Users"
5. Find the corresponding document with the UUID as the title
6. Change "isTeacher" to true
7. Have the teacher refresh the page.

## Tech Info

Tried to keep this simple. The only framework you need to learn for this is React, and apart from that we use firebase for the backend which is relatively intuitive.

**Frontend** JSX/CSS/JS using the React framework. Nice & easy to learn.
**Backend** Firebase (Spark version). Utilising Firebase Auth, Firestore for cloud storage. See Dr. Ioras for access.

## Local setup

1. Ask Dr. Ioras to ask me to add you as a maintainer on the Github repository.
2. Ensure that you have **[Node.js](https://nodejs.org/en)** installed on your computer. This should install "npm" as well.
3. Clone the repository. _I reccomend using [Github Desktop](https://desktop.github.com/download/) if unfamiliar with Git CLI_
4. Use [VS Code](https://code.visualstudio.com/download) or any IDE of your choice.
5. **Run "npm install"** for all of the dependencies to correct migrate. (In the terminal at the correct repo, can be done in VS code from Terminal (at the top left) -> New Terminal)
6. You may require .env.local. Ensure you contact me for that!

## Running Code & Development

**⚠️⚠️ PLEASE PLEASE PLEASE RUN ON A LOCAL BRANCH FIRST AND THEN MERGE WITH THE MAIN BRANCH, EVEN IF YOU ARE ALONE!!! ⚠️⚠️**

1. To run the code use "npm run dev" (on the same terminal i said above)
2. Pushing to main should automatically update the vercel and update the live website! Pushing to main means it ends up in prod!!

## Maintainers & Credits

Listed by Academic Year!

_Shoutout to Yousuf for the 2024-2025 year for the [orginal Maths Society website](https://github.com/yousuf-shahzad/maths-soc-source)._
**2025-2026** : Hiresh Solanki, Aryan Jha
**2026-2027** : TBD

## Microsoft Azure

Since we utilise Micrsoft Authentication, we have an Azure Client Secret that expires every 24 months. If logins randomly stop working around july 2028, someone needs to create a new secret and paste it. Instructions as below:

1. Go to [Azure Portal](https://portal.azure.com/#home)
2. Go to Manage Microsoft Entra ID and click "View"
3. Then go under Manage on the left side, go to App Registrations.
4. Under the All Applications tab, select "Maths Society"
5. Under Essentials, find Client credentials and click on the blue link next to it.
6. Create a new client secret by pressing the button, add a description like "Firebase Login YYYY-YYYY", make it expire in 24 months
7. Copy the secret VALUE (NOT id)
8. Head over to the [Google Firebase console](https://console.firebase.google.com/)
9. Enter the "ucgs-maths-website" firebase project
10. Head over to Authentication web app
11. Switch to the "Sign in method" and click on Microsoft
12. Paste in the new Client Secret that was copied on step 7.

You will of course need access to both ucgsmaths@gmail.com and ucgsmaths@outlook.com to do the above.

## Secrets

If you require .env.local or need to change it, contact me for any Changes @ sol4rtrois@outlook.com. Vercel needs to be updated so please do let me know.

## Changelogs

14/07/2026 | Hiresh Solanki | Website Creation, Revamped README and created TODO.md
20/07/2026 | Hiresh Solanki | Firebase Auth, Firestore + Microsoft Azure Auth Integration using ucgsmaths@gmail.com & ucgsmaths@hotmail.com. Challenge & Newsletter changed. ENV files created. Contact me for .env.local. Dev & Prod environments for backend created.
