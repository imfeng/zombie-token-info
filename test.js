const list = require('./zombiedex.json');
const fs = require('fs');
main()
function main() {
    const result = {};
    for (let index = 0; index < list.length; index++) {
        const item = list[index];
        result[item['token_id']] = [
            item['phase_0'] ?? '',
            item['phase_1'] ?? '',
            item['phase_2'] ?? '',
            item['phase_3'] ?? '',
        ]
    }
    
  fs.writeFileSync('./output.json', JSON.stringify(result), 'utf8', function(err) {
    if (err) return console.log(err);
  });
}
