webpackJsonp([282],{1441:function(module,exports){Intl.PluralRules&&"function"==typeof Intl.PluralRules.__addLocaleData&&Intl.PluralRules.__addLocaleData({data:{mt:{categories:{cardinal:["one","few","many","other"],ordinal:["other"]},fn:function(n,ord){var s=String(n).split("."),n100=Number(s[0])==n&&s[0].slice(-2);return ord?"other":1==n?"one":0==n||n100>=2&&n100<=10?"few":n100>=11&&n100<=19?"many":"other"}}},aliases:{},parentLocales:{},availableLocales:["mt"]})}});