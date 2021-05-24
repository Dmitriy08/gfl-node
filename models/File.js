const fs = require("fs");
const path = require("path");
const USER_MAX_SIZE = 52428800;

class FileApp{
	createUserDir(username) {
		if (!fs.existsSync(upload_dir + '/' + username)){
			fs.mkdirSync(upload_dir + '/' + username);
		}
	}
	__getFolderSize(dirTree) {
		let size = 0;
		dirTree.forEach(item => {
			size += item.sizeBytes
		})
		return size;
	};

	__formatSizeUnits(bytes){
		if      (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(2) + " GB"; }
		else if (bytes >= 1048576)    { bytes = (bytes / 1048576).toFixed(2) + " MB"; }
		else if (bytes >= 1024)       { bytes = (bytes / 1024).toFixed(2) + " KB"; }
		else if (bytes > 1)           { bytes = bytes + " bytes"; }
		else if (bytes == 1)          { bytes = bytes + " byte"; }
		else                          { bytes = "0 bytes"; }
		return bytes;
	}

	getFolderItems(pathName) {
		const res = [];
		try {
			const dirItems = fs.readdirSync(pathName);
			dirItems.forEach((item, i) => {
				try {
					const { basename: base, dir } = path.parse(path.join(pathName, item));
					const stats = fs.statSync(path.join(pathName, item));
					let id = Math.floor(Math.random() * 10000000) + i
					if (stats.isFile()) {
						res.push({
							id: id,
							name: item,
							basename: base,
							dir,
							sizeBytes: stats.size,
							size: this.__formatSizeUnits(stats.size),
							birthtime: new Date(stats.ctime).toLocaleDateString(),
							isFile: stats.isFile(),
							isDir: stats.isDirectory(),
						});
					} else {
						res.push({
							id: id,
							name: item,
							basename: base,
							dir,
							sizeBytes: stats.size,
							size: this.__formatSizeUnits(stats.size),
							birthtime: new Date(stats.ctime).toLocaleDateString(),
							isFile: stats.isFile(),
							isDir: stats.isDirectory(),
							items: this.getFolderItems(path.join(pathName, item)),
						});
					}
				} catch (err) {
					console.log(err);
				}
			});
			return res;
		} catch (err) {
			console.log('ERROR', err);
			return res;
		}
	};

	addFiles(filesList, username){
		filesList.forEach((file, i) => {
			file.mv(
				upload_dir + `/${username}/` + file.name,
				err => {
					const result = {
						id: i,
						name: file.name,
						mimetype: file.mimetype,
						size: file.size,
						status: true,
					};
				}
			);
		});
	}
	getMemory(pathname){
		const usedMemory = this.__getFolderSize(pathname);
		return {
			allMemory: this.__formatSizeUnits(USER_MAX_SIZE),
			freeMemory: this.__formatSizeUnits(USER_MAX_SIZE - usedMemory),
		};
	}
}

module.exports = new FileApp();