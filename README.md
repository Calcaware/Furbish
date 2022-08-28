# Furbish/English Translation
Furby language definitions and translation.

I made some adjustments from the book that came from the original first generation furby since there were some errors.

## Translator Usage
Clone this repository.
Navigate into the directory with `cd path/to/Furbish`

Run this command:
```
node translate.js
```
You will see this usage information.
```
translate options [message]
  Options:
    -e  --english    Furbish to English
    -f  --furbish    English to Furbish
    -h  --help       Get usage information.
  Notes:
    Output words surrounded by {} didn't translate directly.
```
To translate a sentence from English to Furbish run this command:
```
node translate.js -f "I love to watch the sunset"
```
```
kay may-may ay-ay dah a-loh nah-bah
(I love to see big light down)
```

## Examples
#### English to Furbish
```
~$ node translator.js -f me worry you no like sunset
kah boh-bay u-nye boo toh-loo dah a-loh nah-bah
```
#### Furbish to English
```
node translator.js -e kah boh-bay u-nye boo toh-loo dah a-loh nah-bah
me worry you no like sunset
```

## Notes
You can also view my reference material directly in the /reference folder.

The Furbish language appears to be very contexual and there are in theory thousands of compound words so I will continually update this project as long as there is continued interest.

It is a work in progress to take it with a grain of salt.

## To Do
Implement Synonyms (Eat/Hungry)
