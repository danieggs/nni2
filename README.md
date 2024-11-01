# Eggs Website Relaunch (Edge)
The new website of eggs unimedia.

## Knowledge Base
Overview knowledge about **EDGE DELIVERY SERVICES** can be gathered from here. 
https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/using


## Environments
- Preview: https://main--website-relaunch-edge--eggsunimediagmbh.hlx.page/
- Live: https://main--website-relaunch-edge--eggsunimediagmbh.hlx.live/

## Local development

1. Create a new repository based on the `aem-boilerplate` template and add a mountpoint in the `fstab.yaml`
1. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
1. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)

## Development Workflow
Building the Project:
Use **npm run aem:build** to clean the project and compile all assets and TypeScript files.

Starting the Development Server:
Run **npm run aem:up** to start the development server with AEM and watch for changes.

## Pre-Commit Hook
On commit the pre-commit hook builds the component-model.json, component-filter.json and component-definition.json out
of the seperate JSON files from all the blocks. This can be manually tested with 
the command "npm run build:json"

## Linting Code:
Ensure code quality by running **npm run lint** to check for any issues in your JavaScript, TypeScript, and SCSS files.

### Documentation
- [Getting Started Guide](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/edge-dev-getting-started)
- [Creating Blocks](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/create-block)
- [Content Modelling](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/content-modeling)
- [Working with Tabular Data / Spreadsheets](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/tabular-data)

### Presentations and Recordings
- [Getting started with AEM Authoring and Edge Delivery Services](https://experienceleague.adobe.com/en/docs/events/experience-manager-gems-recordings/gems2024/aem-authoring-and-edge-delivery)
