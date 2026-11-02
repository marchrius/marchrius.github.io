(function () {
  function queryValue(name) {
    var query = window.location.search.substring(1).split('&');
    var i;
    for (i = 0; i < query.length; i += 1) {
      var pair = query[i].split('=');
      if (decodeURIComponent(pair[0].replace(/\+/g, ' ')) === name) {
        return decodeURIComponent((pair[1] || '').replace(/\+/g, ' '));
      }
    }
    return '';
  }

  function firstText(parent, tag) {
    var nodes = parent.getElementsByTagName(tag);
    return nodes.length ? (nodes[0].textContent || nodes[0].text || '').replace(/^\s+|\s+$/g, '') : '';
  }

  function addTextItems(parent, tag, list) {
    var nodes = parent.getElementsByTagName(tag);
    var i;
    for (i = 0; i < nodes.length; i += 1) {
      var item = document.createElement('li');
      item.textContent = (nodes[i].textContent || nodes[i].text || '').replace(/^\s+|\s+$/g, '');
      list.appendChild(item);
    }
  }

  function showError() {
    document.getElementById('load-error').hidden = false;
  }

  var bundle = queryValue('p');
  if (!bundle || !/^[A-Za-z0-9][A-Za-z0-9.+-]*$/.test(bundle)) {
    showError();
    return;
  }

  var path = window.location.pathname;
  var marker = '/depictions/';
  var markerAt = path.indexOf(marker);
  var repoRoot = markerAt >= 0 ? path.substring(0, markerAt + 1) : path.replace(/[^/]*$/, '');
  var request = new XMLHttpRequest();
  request.open('GET', repoRoot + 'depictions/' + encodeURIComponent(bundle) + '/info.xml', true);
  request.onreadystatechange = function () {
    if (request.readyState !== 4) return;
    if (request.status < 200 || request.status >= 300 || !request.responseXML) {
      showError();
      return;
    }

    var info = request.responseXML.getElementsByTagName('packageInfo')[0];
    if (!info) {
      showError();
      return;
    }

    var name = firstText(info, 'name');
    var bundleId = firstText(info, 'bundleId');
    var version = firstText(info, 'version');
    document.title = name + ' · Marchrius Cydia Repository';
    document.getElementById('packageTitle').textContent = name;
    document.getElementById('bundleId').textContent = bundleId;
    document.getElementById('version').textContent = 'Versione ' + version;
    document.getElementById('package-id').textContent = bundleId;
    document.getElementById('package-version').textContent = version;

    var minimum = firstText(info, 'miniOS');
    var maximum = firstText(info, 'maxiOS');
    document.getElementById('compatibility').textContent = minimum + (maximum ? ' – ' + maximum : ' e successive');

    addTextItems(info, 'description', document.getElementById('description'));
    addTextItems(info, 'dependency', document.getElementById('dependencies'));

    var changes = info.getElementsByTagName('change');
    var log = document.getElementById('changeLog');
    var i;
    for (i = 0; i < changes.length; i += 1) {
      var entry = document.createElement('div');
      entry.className = 'change';
      var heading = document.createElement('h3');
      heading.textContent = firstText(changes[i], 'changeVersion');
      entry.appendChild(heading);
      var descriptions = changes[i].getElementsByTagName('changeDescription');
      var j;
      for (j = 0; j < descriptions.length; j += 1) {
        var paragraph = document.createElement('p');
        paragraph.textContent = (descriptions[j].textContent || '').replace(/^\s+|\s+$/g, '');
        entry.appendChild(paragraph);
      }
      log.appendChild(entry);
    }
  };
  request.send(null);
}());
