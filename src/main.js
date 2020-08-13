const Apify = require('apify');

const { utils: { log } } = Apify;

const UBUNTU_CLOUD_IMAGES_LOCATOR_PAGE = 'https://cloud-images.ubuntu.com/locator/';
const SELECTOR_WAIT_FOR_HIDDEN_PROCESSING = '#ami_processing';
const SELECTOR_AMI_TABLE_BODY = '#ami > tbody';
const SELECTOR_SHOW_IMAGE_COUNT = {
    selector: 'select[name="ami_length"]',
    value: '100',
};
const INPUT_OUTPUT_MAPPINGS = {
    cloud: '1',
    zone: '2',
    name: '3',
    version: '4',
    arch: '5',
    instanceType: '6',
    release: '7',
    id: '8',
};

/**
 * Constructs output by assembling object from string input
 * @param {string} data - stringified input
 * @returns {object}    - output in object
 */
const constructOutput = (data, numOfResults) => {
    const rows = data.split('\n');
    if (numOfResults > rows.length) {
        log.warning(`Number of results requested is larger than number of results available. Capping at ${rows.length}`);
        numOfResults = rows.length;
    }
    const output = [];
    for (let index = 0; index < numOfResults; index++) {
        const column = rows[index].split('\t');
        // TODO: dynamically update object
        output.push({
            cloud: column[0],
            zone: column[1],
            name: column[2],
            version: column[3],
            arch: column[4],
            instanceType: column[5],
            release: column[6],
            id: column[7],
        });
    }
    return output;
};

/**
 * Uses page.select to filter results. Throws if non-existent value is selected.
 * @param {object} page  - puppeteer's page
 * @param {*} selector   - CSS selector
 * @param {*} inputKey   - key of input
 * @param {*} inputValue - value of input to select
 */
const handleImageFilter = async (page, selector, inputKey, inputValue) => {
    const result = await page.select(selector, inputValue);
    if (result.length === 0) {
        throw new Error(`Invalid value ${inputValue} for input ${inputKey}`);
    }
};

Apify.main(async () => {
    log.info('Starting actor...');

    const input = await Apify.getInput();
    log.debug(JSON.stringify(input, '', 4));

    const numOfResults = input.numberOfResults;
    if (numOfResults < 1) {
        throw new Error('Number of results cannot be less than 1!');
    } else if (typeof numOfResults !== 'number') {
        throw new Error('Number of results must be type of integer.');
    }
    delete input.numberOfResults;

    const requestList = await Apify.openRequestList('default', [UBUNTU_CLOUD_IMAGES_LOCATOR_PAGE]);

    const handlePageFunction = async ({ page }) => {
        await page.waitForSelector(SELECTOR_WAIT_FOR_HIDDEN_PROCESSING, {
            hidden: true,
        });
        await page.select(SELECTOR_SHOW_IMAGE_COUNT.selector, SELECTOR_SHOW_IMAGE_COUNT.value);

        const imageFilters = [];
        for (const [key, value] of Object.entries(input)) {
            // eslint-disable-next-line no-continue
            if (!value || value === 'Any') continue;
            const inputSelector = `#ami > tfoot > tr > th:nth-child(${INPUT_OUTPUT_MAPPINGS[key]}) > select`;
            imageFilters.push(handleImageFilter(page, inputSelector, key, value));
        }
        await Promise.all(imageFilters);

        const table = await page.$eval(
            SELECTOR_AMI_TABLE_BODY,
            (rows) => rows.innerText,
        );
        const output = constructOutput(table, numOfResults);
        Apify.pushData(output);
    };
    const crawlerConfig = {
        requestList,
        handlePageFunction,
    };

    const crawler = new Apify.PuppeteerCrawler(crawlerConfig);
    await crawler.run();

    log.info('Actor finished...');
});
