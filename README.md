# aws_image_recognition application
AWS image recognition application to match a look-alike face in a single or group photo.

## Requirements
1. Install Node.js - version 8.x
2. In root and root/client directory, run below command -
   -> npm install

## Basic Configuration
You need to set up your AWS security credentials before the sample code is able
to connect to AWS. You can do this by creating a file named "credentials" at ~/.aws/
(C:\Users\USER_NAME\.aws\ for Windows users) and saving the following lines in the file:

    [default]
    aws_access_key_id = <your access key id>
    aws_secret_access_key = <your secret key>

## Running the code
1. npm start (Start the server on 5555 port.)
2. Hit http://localhost:5555/ in the browser.
3. Browse the base image in the "Browse Image" form - Will see the preview upon selecting an image from the system.
4. Hit upload button - The application will call aws rekognition API to match the face.
5. If the face is matched successfully, then you'll see that the matched image.
6. Otherwise it will show the error/warning message.