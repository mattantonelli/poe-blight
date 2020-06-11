# Passives Generator
This Ruby script is used to generate the latest version of the `passives.json` file used by the application. It accomplishes this by leveraging the passive tree data provided by GGG alongside the patch notes for the upcoming league.

## Dependencies
* Ruby (2.4.1+)

## Usage

##### 1. Download the passive tree data when it becomes available. Modify the URL as appropriate.
```
cd tmp
wget https://web.poecdn.com/public/news/2020-03-14/Delirium/3100_PassiveSkillTree.zip
unzip 3100_PassiveSkillTree.zip
mv 3100/data.json .
cd ..
```

##### 2. Run the script to generate the updated file
```
ruby generate_passives.rb
```
