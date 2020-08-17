# Ubuntu image scraper

- [Ubuntu image scraper](#ubuntu-image-scraper)
  - [Motivation](#motivation)
  - [Usage](#usage)
    - [Input and Output](#input-and-output)
  - [Limitation / Cavetas](#limitation--cavetas)
  - [Resource consumption](#resource-consumption)
  - [Versioning](#versioning)

This scraper enables you to retrieve Ubuntu image ID(s) available
on various public clouds. Ubuntu is a complete Linux operating system,
freely available with both community and professional support.
If you want to know more about ubuntu check following [docs](https://help.ubuntu.com/lts/installation-guide/s390x/ch01.html).

## Motivation

Imagine you have tons of deployments running in public cloud ([AWS](https://aws.amazon.com/),
[Microsoft Azure](https://azure.microsoft.com/), [Google Cloud](https://cloud.google.com/),..)
on [Ubuntu](https://ubuntu.com/) as your base operating system. These images needs to be periodically
updated for reasons like:

- new features
- bug fixes
- security patches

This scraper saves you time by extracting relevant image IDs for your cloud provider. You can even
hook some post-processor to it (for example opening Pull-Request to your repository).

## Usage

Run as actor on [Apify Platform](https://apify.com).

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

## Resource consumption

One run of this actor consumes cca 0.003 CU, with memory size 1024 MB.
Use of [apify proxy](https://apify.com/proxy) is not required for this actor.

## Versioning

Versioning upholds to Apify standards.
See [docs](https://docs.apify.com/actors/development/source-code#versioning) for more information.
