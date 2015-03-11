function BasicTable(id, config) {
  config = config || {};

  this.createTable = function () {
    var columns = "";
    if (config['columns']) {
      for (var i in config['columns']) {
        columns += "<th>"+config['columns'][i] + "</th>\n";
      }
    }

    var html = "<!-- data table -->                     \
    <table class=\"data-table\">                        \
      <tbody>                                           \
      <tr>"+ columns + "</tr>                           \
      </tbody>                                          \
    </table>                                            \
    <!-- Hidden table used for cloning -->              \
    <table class=\"clone-table\" style=\"display: none;\"> \
      <tbody>                                           \
      <tr>                                              \
          <td>&nbsp;</td>                               \
          <td class=\"counts\">&nbsp;</td>              \
      </tr>                                             \
      </tbody>                                          \
    </table>";
    $(id).hide().html(html);
  }

  this.update = function (data) {
    this.createTable();
    // create the table with the table data
    var tbody = $(id + ' .data-table').find("tbody");
    $(data).each(function (i, page) {
        var row = $(id + ' .clone-table').find("tr:nth-child(1)").clone();
        row.find("td:nth-child(1)").html(page[0]);
        row.find("td:nth-child(2)").html(page[1].toString().commaSeparate());
        row.appendTo(tbody);
    });

    $(id).show();
  }
}