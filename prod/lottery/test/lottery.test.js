const Lottery = artifacts.require('Lottery')
const { expect } = require('chai')
const { web3 } = require('@openzeppelin/test-environment')
contract('Lottery', ([owner, addr1, addr2, addr3]) => {
  let lottery

  beforeEach(async () => {
    lottery = await Lottery.new(web3.utils.toWei('0.01', 'ether'))
    await lottery.enter({
      from: addr1,
      value: web3.utils.toWei('0.01', 'ether'),
    })
    await lottery.enter({
      from: addr2,
      value: web3.utils.toWei('0.01', 'ether'),
    })
  })

  describe('Deployment', () => {
    it('should set the ticket price correctly', async () => {
      const ticketPrice = await lottery.ticketPrice()
      expect(ticketPrice.toString()).to.equal(web3.utils.toWei('0.01', 'ether'))
    })
  })

  describe('Participation', () => {
    it('should allow users to enter the lottery', async () => {
      // Deploy the contract and enter the lottery with addr1
      const lottery = await Lottery.new(web3.utils.toWei('0.01', 'ether'))
      await lottery.enter({
        from: addr1,
        value: web3.utils.toWei('0.01', 'ether'),
      })

      // Get the participants and check if the length is 1
      const participants = await lottery.getParticipants()
      expect(participants.length).to.equal(1)

      // Check if addr1 is the participant in the lottery
      expect(participants[0]).to.equal(addr1)
    })

    it('should reject entries with incorrect ticket price', async () => {
      try {
        await lottery.enter({
          from: addr1,
          value: web3.utils.toWei('0.02', 'ether'),
        })
        assert.fail('The transaction should have thrown an error')
      } catch (err) {
        expect(err.reason).to.equal('Incorrect ticket price')
      }
    })
  })

  describe('Random Number Request and Setting', () => {
    it('should allow only owner to request a random number', async () => {
      await lottery.requestRandomNumber({ from: owner })
      try {
        await lottery.requestRandomNumber({ from: addr1 })
        assert.fail('The transaction should have thrown an error')
      } catch (err) {
        expect(err.reason).to.equal('Ownable: caller is not the owner')
      }
    })

    it('should allow only owner to set a random number', async () => {
      const requestId = web3.utils.randomHex(32)
      await lottery.setRandomNumber(requestId, 12345, { from: owner })
      try {
        await lottery.setRandomNumber(requestId, 12345, { from: addr1 })
        assert.fail('The transaction should have thrown an error')
      } catch (err) {
        expect(err.reason).to.equal('Ownable: caller is not the owner')
      }
    })
  })

  describe('Lottery Execution', () => {
    beforeEach(async () => {
      await lottery.enter({
        from: addr1,
        value: web3.utils.toWei('0.01', 'ether'),
      })
      await lottery.enter({
        from: addr2,
        value: web3.utils.toWei('0.01', 'ether'),
      })
      await lottery.enter({
        from: addr3,
        value: web3.utils.toWei('0.01', 'ether'),
      })
    })

    it('should pick a winner and reset the lottery', async () => {
      const requestId = web3.utils.randomHex(32)
      await lottery.setRandomNumber(requestId, 12345, { from: owner })
      const participantsAfter = await lottery.getParticipants()
      expect(participantsAfter.length).to.equal(0)
    })

    it('should allow only owner to withdraw the balance', async () => {
      await lottery.withdraw({ from: owner })
      try {
        await lottery.withdraw({ from: addr1 })
        assert.fail('The transaction should have thrown an error')
      } catch (err) {
        expect(err.reason).to.equal('Ownable: caller is not the owner')
      }
    })
  })
})
