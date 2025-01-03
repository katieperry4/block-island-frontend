# Block Island LiDAR Experiment
So, sometimes I watch a show called Expedition Unknown and they use LiDAR fairly often during their investigations. That got me wondering if I could get some freely available LiDAR data and render it somehow. So I went to Digital Coast (https://coast.noaa.gov/digitalcoast/) and poked around their data sets to find something suitable. I didn't want to start with anything too large, so I found a scan of Block Island with around 100 million data points.

## Data Processing
100 million still seemed a bit large for the browser to handle rendering so I used Python to downsample the data to around 10 million points. I also assigned a color to each point based off of it's elevation. Then I compressed the file into gzip and uploaded it to AWS S3.
Here's an example of a data point: {"x": 305785.188905348, "y": 53205.9596468261, "elevation": -35.939998626708984, "color": [0, 0, 255]}
And here's a link to the Python files: https://github.com/katieperry4/block-island-data-processing


## Cloud
I wanted to use AWS for this project so I used S3 to hold my data, Lambda to fetch the data, and API gateway to call the Lambda function and send the data to the front end.
Here's my Lambda function, if you're interested:
```

import json
import boto3
import gzip
import base64
import logging

def lambda_handler(event, context):
    s3 = boto3.client("s3")
    bucket_name = 'bucketname'
    file_key = 'filename.gz'

    response = s3.get_object(Bucket=bucket_name, Key=file_key)
    compressed_data = response['Body'].read()

    logging.info("Raw data is: ", compressed_data)
    print("first 20 bytes are: ", compressed_data[:20])
    return {
        'statusCode': 200,
        'body': base64.b64encode(compressed_data).decode('latin1'),
        'headers': {
            "Content-type" : "application/json",
            'Content-Encoding': 'gzip',
            "Access-Control-Allow-Origin": "*"
        },
        'isBase64Encoded': True
    }

```

## Front End
I used React.js for the front end and Three.js to handle the 3D rendering. (Have a look in the components folder, Island.jsx file to see the Three.js logic)
Once I had access to the data in S3 via my API Gateway and Lambda I ended up dividing the values for the data to make them more manageable for Three.js WebGLRenderer to handle. X and Y got divided by 100 and the elevation got divided by 10. I wanted to accentuate the elevation changes since Block Island is not very hilly.

## Final Product
The final product is available here: https://block-island.netlify.app/
All in all this was a fun project and I learned a lot about AWS, python, and three.js!

![block-island-frontend](https://imgur.com/qFtUE4k.jpg)
