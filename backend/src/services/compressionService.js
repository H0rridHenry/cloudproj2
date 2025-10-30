import fs from 'fs';
import zlib from 'zlib';
import sharp from 'sharp';

export function gzipFile(inputPath, outputPath) {
	return new Promise((resolve, reject) => {
		const input = fs.createReadStream(inputPath);
		const output = fs.createWriteStream(outputPath);
		const gzip = zlib.createGzip({ level: 9 });
		input.pipe(gzip).pipe(output);
		output.on('finish', resolve);
		output.on('error', reject);
	});
}

export async function lossyImageCompress(inputPath, outputPath, quality = 70) {
	// Convert to JPEG with quality factor
	await sharp(inputPath).jpeg({ quality, mozjpeg: true }).toFile(outputPath);
}


