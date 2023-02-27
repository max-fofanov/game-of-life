function initialize_canvas() {
    const canvas = document.getElementById("canvas");
    canvas.addEventListener("click", (event) => colorize(event));
}

function colorize(event) {

    const canvas = document.getElementById("canvas");

    if (canvas.getContext) {

        const ctx = canvas.getContext("2d");

        const bounding = canvas.getBoundingClientRect();
        const x = event.clientX - bounding.left;
        const y = event.clientY - bounding.top;

        const imageData = ctx.getImageData(x, y, 1, 1);

        imageData.data[3] = 255 - imageData.data[3];

        ctx.putImageData(imageData, x, y);

        ctx.save();
    }
}

function transformRGBA(RGBA_array) {
    const array = new Array(RGBA_array.length / 4);

    for (let i = 0; i < array.length; ++i) {
        if (RGBA_array[i * 4 + 3] !== 0) {
            array[i] = 1;
        } else {
            array[i] = 0;
        }
    }

    return array;
}


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function process() {
    const canvas = document.getElementById("canvas");

    const height = canvas.height;
    const width = canvas.width;

    if (canvas.getContext) {

        const ctx = canvas.getContext("2d");

        const imageData = ctx.getImageData(0, 0, width, height);

        const matrix = transformRGBA(imageData.data);


        for (let n = 0; n < 1000; n++) {

            const changes = [];

            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    let neighbors = 0;

                    if (j + 1 !== width && matrix[i * height + j + 1] !== 0) {
                        neighbors += 1;
                    }

                    if (j !== 0 && matrix[i * height + j - 1] !== 0) {
                        neighbors += 1;
                    }

                    if (i + 1 !== height && matrix[(i + 1) * height + j] !== 0) {
                        neighbors += 1;
                    }

                    if (i !== 0 && matrix[(i - 1) * height + j] !== 0) {
                        neighbors += 1;
                    }

                    if (i !== 0 && j !== 0 && matrix[(i - 1) * height + j - 1] !== 0) {
                        neighbors += 1;
                    }

                    if (i !== 0 && j + 1 !== width && matrix[(i - 1) * height + j + 1] !== 0) {
                        neighbors += 1;
                    }

                    if (i + 1 !== height && j !== 0 && matrix[(i + 1) * height + j - 1] !== 0) {
                        neighbors += 1;
                    }

                    if (i + 1 !== height && j + 1 !== width && matrix[(i + 1) * height + j + 1] !== 0) {
                        neighbors += 1;
                    }

                    if (neighbors === 3 && matrix[i * height + j] === 0) {
                        changes.push([i, j]);
                    } else if (matrix[i * height + j] !== 0 && (neighbors !== 2 && neighbors !== 3)) {
                        changes.push([i, j]);
                    }
                }
            }

            for (let i = 0; i < changes.length; ++i) {
                matrix[changes[i][0] * height + changes[i][1]] = 1 - matrix[changes[i][0] * height + changes[i][1]];
            }

            for (let i = 0; i < matrix.length; i++) {
                imageData.data[(4 * i) + 3] = 255 * matrix[i];
            }

            ctx.putImageData(imageData, 0, 0);
            ctx.save();
            await sleep(500);
        }
    }

}
