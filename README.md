This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

# OrgaNice

> An app for organizing instructions, recipes, guides, and how-to content in one place.

## About the Project

OrgaNice is a web application for collecting and organizing useful instructions, recipes, guides, and how-to content in one place.

Users can create entries manually or import content from external websites. Entries can be organized into categories and searched to make stored information easier to find and manage.

## Features

- 🔐 GitHub authentication or passwordless login via email magic link
- 📝 Create and manage entries
- 🌐 Import content from external websites via AI
- 🏷️ Organize entries by categories
- 🔎 Search entries
- 👤 Entries are associated with their owner
- 📱 Responsive user interface

## Tech Stack

- **Next.js**
- **React**
- **NextAuth.js**
- **MongoDB**
- **Mongoose**
- **Tailwind CSS**
- **Anthropic API**
- **Cheerio**

## Getting Started

### Prerequisites

Before running the project, make sure you have:

- Node.js
- npm
- A MongoDB database
- A GitHub OAuth application
- An SMTP server/account for sending magic link emails
- An Anthropic API key

### Installation

Clone the repository and install the dependencies:

```bash
npm install

### Create an .env.local file in the root directory

MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
EMAIL_SERVER_HOST=your_smtp_host
EMAIL_SERVER_PORT=your_smtp_port
EMAIL_SERVER_USER=your_smtp_username
EMAIL_SERVER_PASSWORD=your_smtp_password
EMAIL_FROM=your_sender_email_address
ANTHROPIC_API_KEY=your_anthropic_api_key


```
