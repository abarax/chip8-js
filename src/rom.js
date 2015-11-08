export default class Rom {

    static loadFromUrl(url){
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function(e) {
                if (this.status == 200) {
                    resolve(new Uint8Array(this.response));
                    console.log('ROM loaded!');
                }
            };

            xhr.send();
        });
    }

    static loadFromFile(file) {
    }
}
