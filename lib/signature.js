'use strict';

/**
 * Create a signature for the mollie API.
 *
 * N.B. some string mangling has to be done to satisfy signature validations,
 * most notably the differences between php 'http_build_query'
 */

var crypto = require('crypto'),
    Query = require('querystring');

var _stringifySorted = function(query) {
    var keys = Object.keys(query).sort();

    var pairs = keys.reduce(function(collect, key) {
        return collect.concat(Query.escape(key) + '=' + Query.escape(query[key]));
    }, []);

    return pairs.join('&');
};

module.exports = function(path, query, secret) {
    var search = _stringifySorted(query);

    // N.B. Mollie specific: format spaces with a + for a valid signature
    path = '/' + path + '?' + search.replace(/%20/g, '+');

    return crypto.createHmac('sha1', secret).update(path).digest('hex');
};
