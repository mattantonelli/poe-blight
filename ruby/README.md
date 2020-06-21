# Generators

These Ruby scripts are used to generate the latest versions of the application's JSON anointment data.

## Dependencies

* Ruby (2.4.1+)

## Installation

```
bundle install
```

## Usage
### Passives

#### Option 1: Use the live passive tree data

```
ruby generate_passives.rb live
```

**Note:** The `live` option will also save the passive data to `tmp/data.json`. This allows you to run the script again *without* the `live` option to avoid having to re-download the data.

#### Option 2: Use the pre-patch data

Download the passive tree data when it becomes available. Modify the URL and filenames as appropriate.

```
cd tmp
wget https://web.poecdn.com/public/news/2020-03-14/Delirium/3100_PassiveSkillTree.zip
unzip 3100_PassiveSkillTree.zip
mv 3100/data.json .
rm -rf 3100*
cd ..
ruby generate_passives.rb
```

---

After running the script, the `passives.json` file used by the application will be updated with the latest data.

### Tower Enchantments

##### 1. Update `enchantments.csv` with the latest data

A table of new tower enchantments should be provided by GGG shortly before a new patch. ([Example](https://www.pathofexile.com/forum/view-thread/2874150)) You will need to transform this table into CSV and add the new rows to the `enchantments.csv` file in this directory.

||||
|-|-|-|
| Indigo Oil | Clear Oil | Smothering Tower Ailment Chance |

→

```
IndigoOil,ClearOil,Smothering Tower Ailment Chance
```

##### 2. Run the script to generate the updated file

```
ruby generate_enchantments.rb
```

After running the script, the `enchantments.json` file used by the application will be updated with the latest data.

**Note:** The description is left blank since it is not provided by GGG, and will need to be updated from another source, like the wiki.
