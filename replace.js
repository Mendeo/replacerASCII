'use strict';
const fs = require('fs');
const path = require('path');
const input = process.argv[2];
const extension = path.extname(input);
const output = path.basename(input, extension) + '_rep' + extension;
const whatChar = process.argv[3].charCodeAt();
const withChar = process.argv[4].charCodeAt();

fs.open(input, (err, ifd) =>
{
	if (err)
	{
		console.log(err);
	}
	else
	{
		fs.open(output, 'w', (err, ofd) =>
		{
			if (err)
			{
				console.log(err);
			}
			else
			{
				readWrite(ifd, ofd);
			}
		});
	}
});

function readWrite(ifd, ofd)
{
	fs.read(ifd, (err, bytesRead, buffer) =>
	{
		if (err)
		{
			console.log(err);
		}
		else
		{
			if (bytesRead > 0)
			{
				//const data = Buffer.from(buffer.toString().replaceAll('~', ';'));
				let data = new Uint8Array(buffer);
				if (bytesRead < data.length) data = data.slice(0, bytesRead);
				for (let i = 0; i < data.length; i++)
				{
					//~ на ;
					if (data[i] === whatChar) data[i] = withChar;
				}
				fs.write(ofd, data, err =>
				{
					if (err) console.log(err);
				});
				readWrite(ifd, ofd);
			}
		}
	});
}