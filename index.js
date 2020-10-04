const axios = require('axios');
const fs = require('fs');
const fetch = require('node-fetch');

const apiKey = 'apk.632e221730252faa308f122901c59995b9980dc1217ae9f932be68dfb130aa28';

var searchRequest = {
    'search': {
      'shape': {
        'type': 'Polygon',
        'coordinates': [[[-65.039063,-32.212801],[-62.720947,-32.063956],[-62.885742,-30.278044],[-65.302734,-30.439202],[-65.039063,-32.212801]]],
      },
    },
    'page': 1,
    'limit': 4,
};

const zoom = 7;


axios.post('https://gate.eos.com/api/lms/search/v2/landsat8?api_key=' + apiKey,searchRequest)
.then(response => {
    response.data.results.forEach(async tile => {
        var name = tile.view_id;

        axios.post('https://gdw.eos.com/api?api_key=' + apiKey, {
            "type": "jpeg",
            "params": {
                "view_id": name,
                "bm_type":"(B5-B7)/(B5+B7)",
                "resample":"cubic",
                "colormap": "RdYlGn",
                "levels": "-1,1",
                "size": "S",
                "px_size": 60,
                "georeference": "jpeg",
                "name_alias": "sdas",
                "reference": "ref_1543313721"
            }
        })
        .then(response1 => {
            var task = response1.data.task_id;
            axios.get('https://gdw.eos.com/api/' + task + '?api_key=' + apiKey)
            .then(t => {
                console.log(task + ': https://gdw.eos.com/api/' + task + '?api_key=' + apiKey);
            });
        });

        console.log(name);
    });
});