# fragments

CCP555 Project
npm run lint //checks for errors

npm start //runs server normally

npm run dev //runs it via nodemon, which watches the src/\*\* folder for any changes, restarting the server whenever something is updated

npm run debug //the same as dev but also starts the node inspector on port 9229, so that attach a debugger

npm run curl //runs the server with .htpasswd for testing.

ssh -i key-pair.pem ec2-user@xxxx.compute-1.amazonaws.com //connects to AWS ec2 using SSH

docker build -t fragments:latest . //Build fragments image

docker run --rm --name fragments --env-file env.jest -p 8080:8080 fragments //runs the fragments image on port 8080

hadolint Dockerfile //checks the dockerfile for errors

npm version 0.7.0 -m "Release v0.7.0" //Update project version (e.g., 0.7.0)
