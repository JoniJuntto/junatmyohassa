import fetch from 'node-fetch';

const exampleFetch = async () => {
    try {
        const response = await
            fetch('exampleurl.com');
        const json = await response.json();
        return json;
    } catch (error) {
        console.log(error);
    }
}

exampleFetch();
