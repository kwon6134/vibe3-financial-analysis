const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

async function convertXmlToJson() {
  const xmlPath = path.join(__dirname, '../../Desktop/corp.xml');
  const outputPath = path.join(__dirname, '../data/corp-data.json');
  
  console.log('Reading XML file...');
  const xmlData = fs.readFileSync(xmlPath, 'utf-8');
  
  console.log('Parsing XML...');
  const parser = new xml2js.Parser();
  const result = await parser.parseStringPromise(xmlData);
  
  console.log('Converting to JSON format...');
  const companies = result.result.list.map(item => ({
    corp_code: item.corp_code[0],
    corp_name: item.corp_name[0],
    corp_eng_name: item.corp_eng_name[0] || '',
    stock_code: item.stock_code[0] || '',
    modify_date: item.modify_date[0]
  }));
  
  // Ensure data directory exists
  const dataDir = path.dirname(outputPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  console.log(`Writing ${companies.length} companies to JSON...`);
  fs.writeFileSync(outputPath, JSON.stringify(companies, null, 2), 'utf-8');
  
  console.log(`✅ Conversion complete! ${companies.length} companies saved to ${outputPath}`);
}

convertXmlToJson().catch(console.error);

