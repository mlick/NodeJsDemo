/**
 * Created by Administrator on 2016/6/27.
 */
$(function () {
    $('.del').click(function (e) {
        var target = $(e.target)
        var id = target.data('id')
        var tr = $('.item-id-' + id)

        $.ajax({
                type: 'DELETE',
                url: '/admin/list?id=' + id
            })
            .done(function (results) {
                if (results.success === 1) {
                    if (tr.length > 0) {
                        tr.remove()
                    }
                }
            })
    })
})