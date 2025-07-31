/*
    Challenge: Implement a Secure Fund Transfer Function

    In this challenge, you will implement a PostgreSQL stored function to simulate transferring funds 
    between two accounts in a banking system. The function must follow proper validation, ensure data 
    integrity, and log transactions with a shared reference.

    Your function should be named:
    banking.transfer_funds(from_id INT, to_id INT, amount NUMERIC)

    The function must:

    - Prevent transfers to the same account
    - Ensure the transfer amount is greater than zero
    - Validate that both sender and recipient accounts exist
    - Prevent transfers if either account is marked as "frozen"
    - Ensure the sender has sufficient funds
    - Debit the sender and credit the recipient atomically
    - Log two transactions: a withdrawal and a deposit, both linked by the same UUID reference
    - Raise meaningful exceptions for all validation failures

    The function should perform all operations within a safe transactional context, maintaining 
    database consistency even in the event of failure.

    Notes:
    - In order to test you can mock some additional data in the tables that participates in this challenge.
    - Make sure of raising errors when they're present

    ERD:
    +---------------------+            +--------------------------+
    |     accounts        |            |      transactions        |
    +---------------------+            +--------------------------+
    | account_id (PK)     |<-----------| transaction_id (PK)      |
    | balance             |            | account_id (FK)          |
    | status              |            | amount                   |
    +---------------------+            | transaction_type         |
                                       | reference                |
                                       | transaction_date         |
                                       +--------------------------+
*/


-- your solution here

create or replace function banking.transfer_funds(from_id INT, to_id INT, amount_to NUMERIC)
    returns setof banking.transactions
as
$$
declare from_query   banking.accounts%ROWTYPE;
        to_query     banking.accounts%ROWTYPE;
        reference_id text := uuid_generate_v4();
begin
    IF amount_to <= 0 THEN
        RAISE EXCEPTION 'The amount have to be greater than zero, your amount: %', amount_to;
    END IF;

    IF from_id = to_id THEN
        RAISE EXCEPTION 'Trying to transfer to same account, from account: %, to account: %', from_id, to_id
        USING HINT = 'Transfer have to be to different accounts';
    END IF;

    SELECT * INTO from_query FROM banking.accounts a WHERE a.account_id = from_id;
    IF from_query IS NULL THEN
        RAISE EXCEPTION 'The id account % does not exist in table Account', from_id;
    END IF;

    SELECT * INTO to_query FROM banking.accounts a WHERE a.account_id = to_id;
    IF to_query IS NULL THEN
        RAISE EXCEPTION 'The id account % does not exist in table Account', to_id;
    END IF;

    IF from_query.status = 'frozen' OR to_query.status = 'frozen' THEN
        RAISE EXCEPTION 'Both account have to be active to do the transaction';
    END IF;
    
    IF from_query.balance < amount_to THEN
        RAISE EXCEPTION 'The funds are not sufficient to complete the transaction';
    END IF;

    UPDATE banking.accounts a SET balance = (from_query.balance - amount_to) WHERE a.account_id = from_id;
    UPDATE banking.accounts a SET balance = (to_query.balance + amount_to) WHERE a.account_id = to_id;

    INSERT INTO banking.transactions (account_id, amount, transaction_type, reference)
    VALUES (from_id, amount_to, 'withdrawal', reference_id);
    INSERT INTO banking.transactions (account_id, amount, transaction_type, reference)
    VALUES (to_id, amount_to, 'deposit', reference_id);

    return query SELECT * FROM banking.transactions t where t.reference = reference_id;
end
$$ language plpgsql;

select * from banking.transfer_funds(2, 1, 1)