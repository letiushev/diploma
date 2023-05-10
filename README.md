Development workflow:
![alt text](https://github.com/letiushev/diploma/blob/master/images/dev%20dip.png)


Production workflow:
![alt text](https://github.com/letiushev/diploma/blob/master/images/prod%20dip.png)

  Contract: Lottery
    Deployment
      ✔ should set the ticket price correctly
    Participation
      ✔ should allow users to enter the lottery (115ms)
      ✔ should reject entries with incorrect ticket price (178ms)
    Random Number Request and Setting
      ✔ should allow only owner to request a random number (165ms)
      ✔ should allow only owner to set a random number (91ms)
    Lottery Execution
      ✔ should pick a winner and reset the lottery (151ms)
      ✔ should allow only owner to withdraw the balance (104ms)


  7 passing (2s)
