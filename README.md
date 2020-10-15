# Puppeteer examples
This is a repo to create examples with Puppeteer using Node.js


## Linkedin add contacts

To run this scripts please follow the next steps.

1. Create a `.env` file in the root folder project.
2. Add the next environment variables.
```
LINKEDIN_PAGES_TO_SEARCH=10
LINKEDIN_USERNAME='your@email.com'
LINKEDIN_PASSWORD='yourlinkedinpassword'
LINKEDIN_SEARCH_KEYWORD='Machine Learning'
```

The `LINKEDIN_SEARCH_KEYWORD` variable represents the keyword to use. e.g. Frontend Developer, UI/UX, Recruiter, etc. The script will find the exact word in the role or position for each person. 


3. Save the `.env` file and run the command.
```
npm run start
```

### Example
![Example Linkedin](./img/example_linkedin.gif)