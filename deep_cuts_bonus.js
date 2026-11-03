// Deep-cuts bonus question bank (text only). Add entries as {q, a, wrong:[3 decoys], note, source:URL}.
// RULE: every fact must be verified from a real source and its URL recorded in `source`..
const DEEP_CUTS=[
 {q:'Who co-wrote "Peace" with Michael McDonald?',a:'Beth Nielsen Chapman',wrong:['Carole King','Kenny Loggins','Amy Grant'],note:'On Michael McDonald\'s In the Spirit: A Christmas Album (2001).',source:'https://www.swisscharts.com/song/Michael-W.-Smith-with-Michael-McDonald/Peace-1350422 ; https://www.discogs.com/release/3291931-Michael-McDonald-In-The-Spirit'},
 {q:'Who sang with Michael W. Smith on "Peace" from The Spirit of Christmas (2014)?',a:'Michael McDonald',wrong:['Kenny Loggins','Amy Grant','Christopher Cross'],note:'Michael W. Smith, The Spirit of Christmas (2014).',source:'https://www.allmusic.com/album/the-spirit-of-christmas-mw0002727040'}
];
if(typeof module!=='undefined')module.exports=DEEP_CUTS;
