Launch node .
 
Example usage (note dot before command, it's PERPL specific):

> .help
Avaliable commands:
 menu        View all the current menu items
 orders      View all the recent orders in the system (orders placed in the last 24 hours)
 order       Lookup the details of a specific order by order ID
 users       View all the users who have signed up in the last 24 hours
 user        Lookup the details of a specific user by email address
 help        Shows avaliable commands

> .show orders
[ '0wpw5g6yhsrk9gsus725' ]

> .show order 0wpw5g6yhsrk9gsus725
{ items:
   [ { name: 'Caesar Selections',
       description:
        'Crisp romaine lettuce tossed with our homemade Caesar dressing, croutons, and shredded parmesan cheese. With chicken',
       price: 8.95 } ] }
>
>
> .show users
Set { 'qaz2ws@o2.pl' }
>
> .show user qaz2ws@o2.pl
{ name: 'Joey',
  email: 'qaz2ws@o2.pl',
  address: 'Redmond',
  password:
   '36c01663bb735e9fc69e4071056705e9eb1fd38412e3061a410e9101c7ce067a' }
>
