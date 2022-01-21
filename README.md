# Telegram bot demonstration project

## Prerequisities

* AWS account
* Terraform installed and configured
* NPM

## Create a bot

* Chat with [BotFather](https://t.me/botfather/) and create a new bot:

![image](https://user-images.githubusercontent.com/82075/150497553-7c855ae6-0d1e-4221-b528-7b8c19cf8b0b.png)

* Note the token (```5242...nM```)

## Deploy

* ```terraform init```
* ```terraform apply``` <= you'll need the token here

## Use

* Start a chat with your bot
* It echos back all the messages you send to it

![image](https://user-images.githubusercontent.com/82075/150498429-7f0a7665-341b-4a53-b18e-42d10db1cedb.png)

## Cleanup

* ```terraform destroy```
* You should also delete the bot using BotFather
