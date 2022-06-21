https://www.liquid-technologies.com/online-json-to-schema-converter
npm install
npm run lint
npm test
serverless offline --stage dev|uat|prod

Las siguientes lambdas deben ser publicas porque utilizan servicios s3, ses o cognito
banner
serverless invoke local --function postgres --path lib/banner/create.json
booking
serverless invoke local --function postgres --path lib/booking/create.json
serverless invoke local --function postgres --path lib/booking/createB.json
serverless invoke local --function postgres --path lib/booking/createC.json
serverless invoke local --function postgres --path lib/booking/findAll.json
serverless invoke local --function postgres --path lib/booking/findAllByBusinessPaginate.json
serverless invoke local --function postgres --path lib/booking/findByIdBusiness.json
serverless invoke local --function postgres --path lib/booking/getById.json
serverless invoke local --function postgres --path lib/booking/getPayments.json
serverless invoke local --function postgres --path lib/booking/updatePayments.json
business
serverless invoke local --function postgres --path lib/business/create.json
serverless invoke local --function postgres --path lib/business/findById.json
serverless invoke local --function postgres --path lib/business/update.json
product
serverless invoke local --function postgres --path lib/product/create.json
serverless invoke local --function postgres --path lib/product/find.json
serverless invoke local --function postgres --path lib/product/findByIdSport.json
serverless invoke local --function postgres --path lib/product/findSportLocation.json
