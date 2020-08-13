# Ubuntu image scraper

This scraper enables you to retrieve Ubuntu image ID(s) available
on various public clouds.

## Motivation

Imagine you have tons of deployments running in public cloud ([AWS](https://aws.amazon.com/),
[Microsoft Azure](https://azure.microsoft.com/), [Google Cloud](https://cloud.google.com/),..)
on [Ubuntu](https://ubuntu.com/) as your base operating system. These images needs to be periodically
for reasons like feature or security updates.

This scraper saves you time by extracting relevant image IDs for your cloud provider. You can even
hook some post-processor to it (for example opening Pull-Request to your repository).

## Usage

Run as actor on [Apify Platform](https://apify.com).

TODO: CU consumption, resources needed

### Input and Output

This scraper fetches data from <https://cloud-images.ubuntu.com/locator/>. As you can see
dropdowns at the bottom of the page corresponds with inputs.

| Name              | Description                                    | Example               |
| :---------------- | ---------------------------------------------- | --------------------- |
| Cloud             | Select images only for specific cloud provider | Amazon AWS            |
| Zone              | Zone ~ group of data-centers                   | us-east-1             |
| Name              | Ubuntu friendly name                           | focal                 |
| Version           | Ubuntu version                                 | 20.04                 |
| Architecture      | Processor architecture                         | amd64                 |
| Instance type     | Instance type depending on cloud provider      | hvm-ssd               |
| Release           | Ubuntu release                                 | 20200729              |
| ID                | Image ID                                       | ami-0758470213bdd23b1 |
| Number of results | Number of image descriptions to be fetched     | 1                     |

All of the inputs above are optional. However it is not very useful not to provide any, since
they enable you to filter through all the images available.

With following input example you will get latest release of `Ubuntu 20.04` in AWS Northern Virginia region.

Input:

```json
{
    "cloud": "Amazon AWS",
    "zone": "us-east-1",
    "name": "focal",
    "version": "20.04",
    "arch": "Any",
    "instanceType": "hvm-ssd",
    "numberOfResults": 1
}
```

Output:

```json
[
    {
        "cloud": "Amazon AWS",
        "zone": "us-east-1",
        "name": "focal",
        "version": "20.04",
        "arch": "amd64",
        "instanceType": "hvm-ssd",
        "release": "20200729",
        "id": "ami-0758470213bdd23b1"
    }
]
```

## Limitation / Cavetas

- Maximum number of results is limited to 100 due to source page limitations

## Versioning

Versioning upholds to Apify standards.
See [docs](https://docs.apify.com/actors/development/source-code#versioning) for more information.
