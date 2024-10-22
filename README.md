# QuasaScale (A Headscale Admin Web UI)

Quasascale that depends on its backend [QuasaScale Backend](https://github.com/reyzzz/quasaScale-backend) is a modern
Single Page Application built with [Quasar](https://quasar.dev/) to provide
an intuitive and responsive web interface for managing Headscale, a self-hosted,
open-source implementation of Tailscale's coordination server.

This is how it looks like
![nodes](https://github.com/user-attachments/assets/30b46747-c6ed-4087-9422-47777ef82b81)
![users](https://github.com/user-attachments/assets/18d5fcc1-b2f6-4c24-9f1b-da35b353c246)
![dns-settings](https://github.com/user-attachments/assets/63f7b10c-966c-4d2a-976a-cf6131969b41)
![dns-records](https://github.com/user-attachments/assets/8ef77c0b-0bf9-4a3f-8bcb-051e0488d03d)
![groups](https://github.com/user-attachments/assets/9592801e-09b5-4326-be9b-15314e2f5ca5)
![acls](https://github.com/user-attachments/assets/11bf6f45-a00c-4e3a-bbd7-1c0ce6f256dc)
![hinstances](https://github.com/user-attachments/assets/a9115e14-51b5-410d-8787-6dcddc987115)

## Features
1. Node Management: Add, remove, and edit nodes quickly, manage routes, expire node and <b>IP address management</b>.
1. User Management: Manage users and pre auth keys.
1. DNS Management: Change your tailnet name, magic DNS, name servers, search domains and extra records.
1. ACL Management: Through a nice web interface manage your groups, tag owners, hosts and acls.
1. Headscale Instance Management: You can add multiple headscale instances
1. Responsive UI: Optimized for desktop and mobile browsers.
1. API Integration: Uses the QuasaScale Backend and Headscale API for seamless management and control.

## Getting Started
Prerequisites

Before you begin, ensure you have the following installed:

- Headscale instance and QuasaScale Backend (running and accessible)
- A web server (e.g. Nginx, Apache...)

Download latest release and serve the folder with your web server

Once you open the app you will need to add a headscale instance. Here you need:
- A name that you give for the instance
- QuasaScale Backend url ending with /api. e.g. https://quasascale-backend.io/api
- Token that you created while setting up QuasaScale Backend, it's the headscale token.
